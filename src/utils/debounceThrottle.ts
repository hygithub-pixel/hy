/**
 * 防抖函数
 * @template T - 函数类型
 * @param fn - 要执行的函数
 * @param delay - 延迟时间（毫秒）
 * @param immediate - 是否立即执行，默认为false
 * @returns 防抖处理后的函数
 * @example
 * ```typescript
 * const debouncedFunction = debounce((value) => {
 *   console.log('Value:', value);
 * }, 300);
 * 
 * // 连续调用只会在最后一次调用后300ms执行
 * debouncedFunction('test1');
 * debouncedFunction('test2');
 * debouncedFunction('test3'); // 只有这次会执行
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  immediate: boolean = false
): (...args: Parameters<T>) => ReturnType<T> extends Promise<any> ? Promise<ReturnType<T>> : void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (timer) {
      clearTimeout(timer);
    }

    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, delay);
      if (callNow) {
        return fn.apply(context, args);
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args);
        timer = null;
      }, delay);
    }
  } as any;
}

/**
 * 节流函数
 * @template T - 函数类型
 * @param fn - 要执行的函数
 * @param delay - 时间间隔（毫秒）
 * @returns 节流处理后的函数
 * @example
 * ```typescript
 * const throttledFunction = throttle((value) => {
 *   console.log('Value:', value);
 * }, 300);
 * 
 * // 连续调用只会每300ms执行一次
 * throttledFunction('test1'); // 执行
 * throttledFunction('test2'); // 忽略
 * throttledFunction('test3'); // 忽略
 * // 300ms后
 * throttledFunction('test4'); // 执行
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => ReturnType<T> extends Promise<any> ? Promise<ReturnType<T>> : void {
  let lastCallTime = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    const now = Date.now();
    const remaining = delay - (now - lastCallTime);

    if (remaining <= 0 || remaining > delay) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastCallTime = now;
      return fn.apply(context, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastCallTime = Date.now();
        timer = null;
        fn.apply(context, args);
      }, remaining);
    }
  } as any;
}

/**
 * 带取消功能的防抖函数
 * @template T - 函数类型
 * @param fn - 要执行的函数
 * @param delay - 延迟时间（毫秒）
 * @param immediate - 是否立即执行，默认为false
 * @returns 带取消和 flush 方法的防抖函数
 * @example
 * ```typescript
 * const debounced = debounceWithCancel((value) => {
 *   console.log('Value:', value);
 * }, 300);
 * 
 * debounced('test');
 * // 取消防抖
 * debounced.cancel();
 * 
 * // 立即执行
 * debounced('test2');
 * debounced.flush(); // 立即执行
 * ```
 */
export function debounceWithCancel<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  immediate: boolean = false
): {
  (...args: Parameters<T>): void;
  /** 取消防抖 */
  cancel: () => void;
  /** 立即执行并清空防抖 */
  flush: () => void;
} {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastContext: any = null;

  const debounced = function (this: any, ...args: Parameters<T>) {
    lastContext = this;
    lastArgs = args;

    if (timer) {
      clearTimeout(timer);
    }

    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, delay);
      if (callNow) {
        fn.apply(lastContext, lastArgs);
      }
    } else {
      timer = setTimeout(() => {
        if (lastArgs) {
          fn.apply(lastContext, lastArgs);
        }
        timer = null;
        lastArgs = null;
        lastContext = null;
      }, delay);
    }
  };

  debounced.cancel = function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastArgs = null;
    lastContext = null;
  };

  debounced.flush = function () {
    if (timer && lastArgs) {
      clearTimeout(timer);
      timer = null;
      fn.apply(lastContext, lastArgs);
      lastArgs = null;
      lastContext = null;
    }
  };

  return debounced;
}

/**
 * 带取消功能的节流函数
 * @template T - 函数类型
 * @param fn - 要执行的函数
 * @param delay - 时间间隔（毫秒）
 * @returns 带取消方法的节流函数
 * @example
 * ```typescript
 * const throttled = throttleWithCancel((value) => {
 *   console.log('Value:', value);
 * }, 300);
 * 
 * throttled('test');
 * // 取消节流
 * throttled.cancel();
 * ```
 */
export function throttleWithCancel<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): {
  (...args: Parameters<T>): void;
  /** 取消节流 */
  cancel: () => void;
} {
  let lastCallTime = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const throttled = function (this: any, ...args: Parameters<T>) {
    const context = this;
    const now = Date.now();
    const remaining = delay - (now - lastCallTime);

    if (remaining <= 0 || remaining > delay) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastCallTime = now;
      fn.apply(context, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastCallTime = Date.now();
        timer = null;
        fn.apply(context, args);
      }, remaining);
    }
  };

  throttled.cancel = function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastCallTime = 0;
  };

  return throttled;
}
