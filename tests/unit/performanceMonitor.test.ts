import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// 模拟import.meta.env
vi.stubGlobal('import.meta.env', {
  PROD: false,
});

// 现在导入PerformanceMonitor
import { PerformanceMonitor } from '@/utils/performance/monitor';

// 模拟浏览器环境
const mockPerformance = {
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByName: vi.fn(),
  getEntriesByType: vi.fn(),
};

const mockNavigationTiming = {
  navigationStart: 1000,
  domContentLoadedEventEnd: 1500,
  loadEventEnd: 2000,
  fetchStart: 1010,
  responseEnd: 1200,
  connectEnd: 1050,
  connectStart: 1020,
};

const mockPaintTiming = [
  { name: 'first-paint', startTime: 1300 },
  { name: 'first-contentful-paint', startTime: 1400 },
];

const mockResourceTiming = [];

const mockSendBeacon = vi.fn();
const mockFetch = vi.fn().mockResolvedValue({});

// 模拟全局对象
beforeEach(() => {
  global.window = {
    performance: mockPerformance,
    location: { href: 'http://localhost:3000' },
    navigator: {
      userAgent: 'Mozilla/5.0',
      sendBeacon: mockSendBeacon,
    },
  } as any;

  global.performance = mockPerformance as any;
  global.fetch = mockFetch;

  // 模拟import.meta.env.PROD
  vi.stubGlobal('import.meta.env', {
    PROD: false,
  });

  // 模拟PerformanceObserver
  global.PerformanceObserver = vi.fn().mockImplementation((callback) => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
  }));

  // 模拟getEntriesByType
  mockPerformance.getEntriesByType.mockImplementation((type) => {
    switch (type) {
      case 'navigation':
        return [mockNavigationTiming];
      case 'paint':
        return mockPaintTiming;
      case 'resource':
        return mockResourceTiming;
      default:
        return [];
    }
  });

  // 模拟getEntriesByName
  mockPerformance.getEntriesByName.mockReturnValue([{
    duration: 100,
  }]);

  vi.spyOn(console, 'group').mockImplementation();
  vi.spyOn(console, 'groupEnd').mockImplementation();
  vi.spyOn(console, 'table').mockImplementation();
  vi.spyOn(console, 'warn').mockImplementation();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('PerformanceMonitor', () => {
  it('should initialize correctly', () => {
    const monitor = new PerformanceMonitor();
    expect(monitor).toBeDefined();
  });

  it('should mark performance points', () => {
    const monitor = new PerformanceMonitor();
    monitor.mark('test-mark');
    expect(mockPerformance.mark).toHaveBeenCalledWith('test-mark');
  });

  it('should measure performance with start and end marks', () => {
    const monitor = new PerformanceMonitor();
    monitor.measure('test-measure', 'start-mark', 'end-mark');
    expect(mockPerformance.measure).toHaveBeenCalledWith('test-measure', 'start-mark', 'end-mark');
  });

  it('should measure performance with only start mark', () => {
    const monitor = new PerformanceMonitor();
    monitor.measure('test-measure', 'start-mark');
    expect(mockPerformance.measure).toHaveBeenCalledWith('test-measure', 'start-mark');
  });

  it('should handle measurement errors gracefully', () => {
    const monitor = new PerformanceMonitor();
    mockPerformance.measure.mockImplementation(() => {
      throw new Error('Measurement error');
    });
    monitor.measure('test-measure', 'start-mark');
    expect(console.warn).toHaveBeenCalled();
  });

  it('should start and end measure', () => {
    const monitor = new PerformanceMonitor();
    monitor.startMeasure('test');
    monitor.endMeasure('test');
    expect(mockPerformance.mark).toHaveBeenCalledWith('test-start');
    expect(mockPerformance.mark).toHaveBeenCalledWith('test-end');
    expect(mockPerformance.measure).toHaveBeenCalledWith('test', 'test-start', 'test-end');
  });

  it('should get metrics', () => {
    const monitor = new PerformanceMonitor();
    const metrics = monitor.getMetrics();
    expect(Array.isArray(metrics)).toBe(true);
  });

  it('should get performance report', () => {
    const monitor = new PerformanceMonitor();
    const report = monitor.getReport();
    expect(report).toHaveProperty('metrics');
    expect(report).toHaveProperty('timestamp');
    expect(report).toHaveProperty('url');
    expect(report).toHaveProperty('userAgent');
  });

  it('should log report in development', () => {
    const monitor = new PerformanceMonitor();
    monitor.logReport();
    expect(console.group).toHaveBeenCalledWith('📊 性能监控报告');
    expect(console.table).toHaveBeenCalled();
    expect(console.groupEnd).toHaveBeenCalled();
  });

  it('should not send report in development', () => {
    const monitor = new PerformanceMonitor();
    const endpoint = 'https://example.com/performance';
    monitor.sendReport(endpoint);
    expect(mockSendBeacon).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should not send report without endpoint', () => {
    const monitor = new PerformanceMonitor();
    monitor.sendReport();
    expect(mockSendBeacon).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should destroy resources', () => {
    const monitor = new PerformanceMonitor();
    expect(() => monitor.destroy()).not.toThrow();
  });

  it('should initialize gracefully in non-browser environment', () => {
    // 移除window对象
    delete global.window;
    delete global.performance;

    expect(() => new PerformanceMonitor()).not.toThrow();
  });
});