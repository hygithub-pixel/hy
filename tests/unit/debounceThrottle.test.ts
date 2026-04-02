import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, throttle, debounceWithCancel, throttleWithCancel } from '../../src/utils/debounceThrottle';

describe('debounceThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('debounce', () => {
    it('should debounce function execution', async () => {
      const callback = vi.fn();
      const debounced = debounce(callback, 100);

      debounced();
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      debounced();
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should execute immediately when immediate is true', () => {
      const callback = vi.fn();
      const debounced = debounce(callback, 100, true);

      debounced();
      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('should throttle function execution', () => {
      const callback = vi.fn();
      const throttled = throttle(callback, 100);

      throttled();
      expect(callback).toHaveBeenCalledTimes(1);

      throttled();
      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttled();
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('debounceWithCancel', () => {
    it('should cancel debounced function', () => {
      const callback = vi.fn();
      const debounced = debounceWithCancel(callback, 100);

      debounced();
      debounced.cancel();

      vi.advanceTimersByTime(100);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('throttleWithCancel', () => {
    it('should cancel throttled function', () => {
      const callback = vi.fn();
      const throttled = throttleWithCancel(callback, 100);

      throttled();
      expect(callback).toHaveBeenCalledTimes(1);

      throttled.cancel();
      vi.advanceTimersByTime(100);
      throttled();
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });
});
