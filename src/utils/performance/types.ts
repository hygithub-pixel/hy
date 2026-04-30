export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'navigation' | 'resource' | 'paint' | 'custom';
}

export interface PerformanceReport {
  metrics: PerformanceMetric[];
  timestamp: number;
  url: string;
  userAgent: string;
}

export interface MetricsCollector {
  collect(): void;
  getMetrics(): PerformanceMetric[];
}
