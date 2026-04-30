import type { PerformanceMetric, MetricsCollector } from './types';

export class PaintMetricsCollector implements MetricsCollector {
  private metrics: PerformanceMetric[] = [];

  collect(): void {
    if (typeof window === 'undefined' || !window.performance) {
      return;
    }

    this.collectPaintTiming();
  }

  private collectPaintTiming(): void {
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
      this.metrics.push({
        name: entry.name,
        value: Math.round(entry.startTime * 100) / 100,
        timestamp: Date.now(),
        type: 'paint' as const,
      });
    });
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }
}
