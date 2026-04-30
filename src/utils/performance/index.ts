import { PerformanceMonitor } from './monitor';
import type { PerformanceMetric, PerformanceReport } from './types';

export const performanceMonitor = new PerformanceMonitor();

export const usePerformanceMonitor = () => {
  return {
    mark: (name: string) => performanceMonitor.mark(name),
    startMeasure: (name: string) => performanceMonitor.startMeasure(name),
    endMeasure: (name: string) => performanceMonitor.endMeasure(name),
    getMetrics: () => performanceMonitor.getMetrics(),
    logReport: () => performanceMonitor.logReport(),
    sendReport: (endpoint: string) => performanceMonitor.sendReport(endpoint),
  };
};

export type { PerformanceMetric, PerformanceReport };
export { PerformanceMonitor };
