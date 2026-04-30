import type { PerformanceMetric, PerformanceReport, MetricsCollector } from './types';
import { NavigationMetricsCollector } from './navigation';
import { PaintMetricsCollector } from './paint';
import { WebVitalsCollector } from './webVitals';
import { ResourceMetricsCollector } from './resource';

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private collectors: MetricsCollector[] = [];
  private resourceCollector!: ResourceMetricsCollector;
  private isProduction = import.meta.env.PROD;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined' || !window.performance) {
      return;
    }

    this.resourceCollector = new ResourceMetricsCollector();
    this.collectors = [
      new NavigationMetricsCollector(),
      new PaintMetricsCollector(),
      new WebVitalsCollector(),
      this.resourceCollector,
    ];

    this.collectors.forEach(collector => {
      collector.collect();
    });
  }

  private addMetric(name: string, value: number, type: PerformanceMetric['type']) {
    this.metrics.push({
      name,
      value: Math.round(value * 100) / 100,
      timestamp: Date.now(),
      type,
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
    const allMetrics = [...this.metrics];
    this.collectors.forEach(collector => {
      allMetrics.push(...collector.getMetrics());
    });
    return allMetrics;
  }

  public getReport(): PerformanceReport {
    return {
      metrics: this.getMetrics(),
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };
  }

  public logReport() {
    if (this.isProduction) return;

    const allMetrics = this.getMetrics();
    console.group('📊 性能监控报告');
    console.table(
      allMetrics.map(m => ({
        指标: m.name,
        值: `${m.value.toFixed(2)}ms`,
        类型: m.type,
      }))
    );
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
        keepalive: true,
      }).catch(() => {});
    }
  }

  public destroy() {
    this.resourceCollector.destroy();
    this.metrics = [];
  }
}
