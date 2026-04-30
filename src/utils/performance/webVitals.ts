import type { PerformanceMetric, MetricsCollector } from './types';

export class WebVitalsCollector implements MetricsCollector {
  private metrics: PerformanceMetric[] = [];

  collect(): void {
    if (typeof window === 'undefined' || !window.performance || typeof PerformanceObserver === 'undefined') {
      return;
    }

    this.collectWebVitals();
  }

  private collectWebVitals(): void {
    try {
      // 采集LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.push({
          name: 'LCP (最大内容绘制)',
          value: Math.round(lastEntry.startTime * 100) / 100,
          timestamp: Date.now(),
          type: 'paint' as const,
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // 采集CLS (Cumulative Layout Shift)
      const clsObserver = new PerformanceObserver(list => {
        let clsValue = 0;
        list.getEntries().forEach(entry => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        if (clsValue > 0) {
          this.metrics.push({
            name: 'CLS (累积布局偏移)',
            value: Math.round(clsValue * 1000) / 1000,
            timestamp: Date.now(),
            type: 'paint' as const,
          });
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // 采集FID (First Input Delay)
      const fidObserver = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          this.metrics.push({
            name: 'FID (首次输入延迟)',
            value: Math.round(((entry as any).processingStart - entry.startTime) * 100) / 100,
            timestamp: Date.now(),
            type: 'paint' as const,
          });
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('Web Vitals not fully supported');
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }
}
