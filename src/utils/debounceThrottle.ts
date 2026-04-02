// 防抖函数
// fn: 要执行的函数
// delay: 延迟时间（毫秒）
// immediate: 是否立即执行
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  immediate: boolean = false
): (...args: Parameters<T>) => ReturnType<T> extends Promise<any> ? Promise<ReturnType<T>> : void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
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

// 节流函数
// fn: 要执行的函数
// delay: 时间间隔（毫秒）
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => ReturnType<T> extends Promise<any> ? Promise<ReturnType<T>> : void {
  let lastCallTime = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
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

// 带取消功能的防抖函数
export function debounceWithCancel<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  immediate: boolean = false
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
} {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastContext: any = null;
  
  const debounced = function(this: any, ...args: Parameters<T>) {
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
  
  debounced.cancel = function() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastArgs = null;
    lastContext = null;
  };
  
  debounced.flush = function() {
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

// 带取消功能的节流函数
export function throttleWithCancel<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
} {
  let lastCallTime = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  
  const throttled = function(this: any, ...args: Parameters<T>) {
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
  
  throttled.cancel = function() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastCallTime = 0;
  };
  
  return throttled;
}
