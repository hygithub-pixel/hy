import type { PerformanceMetric, MetricsCollector } from './types';

export class NavigationMetricsCollector implements MetricsCollector {
  private metrics: PerformanceMetric[] = [];

  collect(): void {
    if (typeof window === 'undefined' || !window.performance) {
      return;
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return;

    const navigationMetrics = [
      { name: 'DNS查询时间', value: navigation.domainLookupEnd - navigation.domainLookupStart },
      { name: 'TCP连接时间', value: navigation.connectEnd - navigation.connectStart },
      {
        name: 'SSL握手时间',
        value:
          navigation.secureConnectionStart > 0
            ? navigation.connectEnd - navigation.secureConnectionStart
            : 0,
      },
      { name: 'DOM解析时间', value: navigation.domInteractive - navigation.responseEnd },
      {
        name: '资源加载时间',
        value: navigation.loadEventStart - navigation.domContentLoadedEventEnd,
      },
      { name: '首字节时间(TTFB)', value: navigation.responseStart - navigation.requestStart },
      { name: '页面完全加载时间', value: navigation.loadEventEnd - navigation.fetchStart },
      { name: 'DOM构建时间', value: navigation.domComplete - navigation.domInteractive },
    ];

    navigationMetrics.forEach(metric => {
      this.metrics.push({
        name: metric.name,
        value: Math.round(metric.value * 100) / 100,
        timestamp: Date.now(),
        type: 'navigation' as const,
      });
    });
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }
}
