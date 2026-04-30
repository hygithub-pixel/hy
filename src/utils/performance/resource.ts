import type { PerformanceMetric, MetricsCollector } from './types';

export class ResourceMetricsCollector implements MetricsCollector {
  private metrics: PerformanceMetric[] = [];
  private observer: PerformanceObserver | null = null;

  collect(): void {
    if (typeof window === 'undefined' || !window.performance || typeof PerformanceObserver === 'undefined') {
      return;
    }

    this.setupResourceObserver();
  }

  private setupResourceObserver(): void {
    try {
      this.observer = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            if (resourceEntry.duration > 1000) {
              this.metrics.push({
                name: `慢资源: ${resourceEntry.name}`,
                value: Math.round(resourceEntry.duration * 100) / 100,
                timestamp: Date.now(),
                type: 'resource' as const,
              });
            }
          }
        });
      });
      this.observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.warn('Resource observer not supported');
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
