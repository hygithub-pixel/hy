interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'navigation' | 'resource' | 'paint' | 'custom';
}

interface PerformanceReport {
  metrics: PerformanceMetric[];
  timestamp: number;
  url: string;
  userAgent: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observer: PerformanceObserver | null = null;
  private isProduction = import.meta.env.PROD;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined' || !window.performance) {
      return;
    }

    this.collectNavigationTiming();
    this.collectPaintTiming();
    this.setupResourceObserver();
    this.collectWebVitals();
  }

  private collectNavigationTiming() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return;

    const metrics = [
      { name: 'DNS查询时间', value: navigation.domainLookupEnd - navigation.domainLookupStart },
      { name: 'TCP连接时间', value: navigation.connectEnd - navigation.connectStart },
      { name: 'SSL握手时间', value: navigation.secureConnectionStart > 0 ? navigation.connectEnd - navigation.secureConnectionStart : 0 },
      { name: 'DOM解析时间', value: navigation.domInteractive - navigation.responseEnd },
      { name: '资源加载时间', value: navigation.loadEventStart - navigation.domContentLoadedEventEnd },
      { name: '首字节时间(TTFB)', value: navigation.responseStart - navigation.requestStart },
      { name: '页面完全加载时间', value: navigation.loadEventEnd - navigation.fetchStart },
      { name: 'DOM构建时间', value: navigation.domComplete - navigation.domInteractive }
    ];

    metrics.forEach(metric => {
      this.addMetric(metric.name, metric.value, 'navigation');
    });
  }

  private collectPaintTiming() {
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
      this.addMetric(entry.name, entry.startTime, 'paint');
    });
  }

  private setupResourceObserver() {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      this.observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            if (resourceEntry.duration > 1000) {
              this.addMetric(`慢资源: ${resourceEntry.name}`, resourceEntry.duration, 'resource');
            }
          }
        });
      });
      this.observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.warn('PerformanceObserver not supported');
    }
  }

  private collectWebVitals() {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.addMetric('LCP (最大内容绘制)', lastEntry.startTime, 'paint');
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach(entry => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        if (clsValue > 0) {
          this.addMetric('CLS (累积布局偏移)', clsValue, 'paint');
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.addMetric('FID (首次输入延迟)', (entry as any).processingStart - entry.startTime, 'paint');
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('Web Vitals not fully supported');
    }
  }

  private addMetric(name: string, value: number, type: PerformanceMetric['type']) {
    this.metrics.push({
      name,
      value: Math.round(value * 100) / 100,
      timestamp: Date.now(),
      type
    });
  }

  public mark(name: string) {
    if (typeof performance !== 'undefined') {
      performance.mark(name);
    }
  }

  public measure(name: string, startMark: string, endMark?: string) {
    if (typeof performance !== 'undefined') {
      try {
        if (endMark) {
          performance.measure(name, startMark, endMark);
        } else {
          performance.measure(name, startMark);
        }
        const measures = performance.getEntriesByName(name, 'measure');
        const lastMeasure = measures[measures.length - 1];
        if (lastMeasure) {
          this.addMetric(name, lastMeasure.duration, 'custom');
        }
      } catch (e) {
        console.warn(`Failed to measure ${name}:`, e);
      }
    }
  }

  public startMeasure(name: string) {
    this.mark(`${name}-start`);
  }

  public endMeasure(name: string) {
    this.mark(`${name}-end`);
    this.measure(name, `${name}-start`, `${name}-end`);
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getReport(): PerformanceReport {
    return {
      metrics: this.getMetrics(),
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
  }

  public logReport() {
    if (this.isProduction) return;

    console.group('📊 性能监控报告');
    console.table(this.metrics.map(m => ({
      指标: m.name,
      值: `${m.value.toFixed(2)}ms`,
      类型: m.type
    })));
    console.groupEnd();
  }

  public sendReport(endpoint?: string) {
    if (!this.isProduction || !endpoint) return;

    const report = this.getReport();
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, JSON.stringify(report));
    } else {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
        keepalive: true
      }).catch(() => {});
    }
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

export const usePerformanceMonitor = () => {
  return {
    mark: (name: string) => performanceMonitor.mark(name),
    startMeasure: (name: string) => performanceMonitor.startMeasure(name),
    endMeasure: (name: string) => performanceMonitor.endMeasure(name),
    getMetrics: () => performanceMonitor.getMetrics(),
    logReport: () => performanceMonitor.logReport(),
    sendReport: (endpoint: string) => performanceMonitor.sendReport(endpoint)
  };
};
