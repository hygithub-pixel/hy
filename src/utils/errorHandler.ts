import { ElMessage } from 'element-plus';

// 错误类型定义
export interface AppError {
  code?: string;
  message: string;
  data?: any;
  stack?: string;
}

// 错误处理选项
export interface ErrorHandlerOptions {
  showMessage?: boolean;
  logError?: boolean;
  retry?: () => void;
  fallback?: () => void;
}

// 错误处理类
export class ErrorHandler {
  // 处理错误
  static handle(error: any, options: ErrorHandlerOptions = {}): AppError {
    const { showMessage = true, logError = true, fallback } = options;
    
    // 标准化错误对象
    const appError = this.normalizeError(error);
    
    // 记录错误日志（请求取消和 MockJS 事件错误不记录）
    if (logError && appError.code !== 'ERR_CANCELED' && appError.code !== 'MOCKJS_EVENT_ERROR') {
      this.logError(appError);
    }
    
    // 显示错误消息（请求取消和 MockJS 事件错误不显示）
    if (showMessage && appError.code !== 'ERR_CANCELED' && appError.code !== 'MOCKJS_EVENT_ERROR') {
      this.showErrorMessage(appError);
    }
    
    // 执行回退操作
    if (fallback) {
      try {
        fallback();
      } catch (fallbackError) {
        console.error('Fallback execution failed:', fallbackError);
      }
    }
    
    return appError;
  }
  
  // 标准化错误对象
  private static normalizeError(error: any): AppError {
    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack
      };
    }
    
    if (typeof error === 'string') {
      return {
        message: error
      };
    }
    
    if (error && typeof error === 'object') {
      return {
        code: error.code,
        message: error.message || error.msg || '未知错误',
        data: error.data,
        stack: error.stack
      };
    }
    
    return {
      message: '未知错误'
    };
  }
  
  // 记录错误日志
  private static logError(error: AppError): void {
    console.error('App Error:', error);
    
    // 这里可以添加更复杂的日志记录逻辑
    // 例如：发送错误到监控服务、写入日志文件等
  }
  
  // 显示错误消息
  private static showErrorMessage(error: AppError): void {
    ElMessage.error({
      message: error.message,
      duration: 3000
    });
  }
  
  // 处理网络错误
  static handleNetworkError(error: any, options?: ErrorHandlerOptions): AppError {
    const networkError = {
      ...this.normalizeError(error),
      message: error.message || '网络请求失败，请检查网络连接'
    };
    
    return this.handle(networkError, options);
  }
  
  // 处理 API 错误
  static handleApiError(error: any, options?: ErrorHandlerOptions): AppError {
    // 处理请求取消错误
    if (error?.__CANCEL__ || error?.message === '请求被取消' || error?.code === 'ERR_CANCELED') {
      // 不显示请求取消的错误消息
      return {
        message: '请求被取消',
        code: 'ERR_CANCELED'
      };
    }
    
    // 处理 MockJS 的 Event 构造错误
    if (error?.message && error.message.includes('Failed to construct \'Event\'')) {
      // 不显示 MockJS 的 Event 构造错误
      return {
        message: 'MockJS 事件构造错误',
        code: 'MOCKJS_EVENT_ERROR'
      };
    }
    
    let apiError: AppError;
    
    if (error.response) {
      // 服务器返回错误
      const status = error.response.status;
      const data = error.response.data;
      
      apiError = {
        code: data.code || String(status),
        message: data.message || data.msg || `请求失败 (${status})`,
        data: data
      };
    } else if (error.request) {
      // 请求已发送但没有收到响应
      apiError = {
        message: '服务器无响应，请稍后重试'
      };
    } else {
      // 请求配置出错
      apiError = {
        message: error.message || '请求配置错误'
      };
    }
    
    return this.handle(apiError, options);
  }
  
  // 处理表单验证错误
  static handleValidationError(errors: Record<string, string[]>, options?: ErrorHandlerOptions): AppError {
    const errorMessages = Object.values(errors).flat();
    const message = errorMessages.length > 0 ? errorMessages[0] : '表单验证失败';
    
    const validationError: AppError = {
      message,
      data: errors
    };
    
    return this.handle(validationError, options);
  }
}

// 错误处理装饰器
export function ErrorBoundary(options: ErrorHandlerOptions = {}) {
  return function(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        ErrorHandler.handle(error, options);
        throw error; // 重新抛出错误，以便上层捕获
      }
    };
    
    return descriptor;
  };
}

// 异步错误处理工具
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options: ErrorHandlerOptions = {}
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    ErrorHandler.handle(error, options);
    return null;
  }
}

// 全局错误捕获
export function setupGlobalErrorHandler() {
  // 捕获未处理的 Promise 拒绝
  window.addEventListener('unhandledrejection', (event) => {
    // 忽略 MockJS 的 Event 构造错误
    if (event.reason?.message && event.reason.message.includes('Failed to construct \'Event\'')) {
      console.log('MockJS Event 构造错误，已忽略');
      return;
    }
    ErrorHandler.handle(event.reason, {
      showMessage: true,
      logError: true
    });
  });
  
  // 捕获未捕获的错误
  window.addEventListener('error', (event) => {
    // 忽略 MockJS 的 Event 构造错误
    if (event.error?.message && event.error.message.includes('Failed to construct \'Event\'')) {
      console.log('MockJS Event 构造错误，已忽略');
      return;
    }
    ErrorHandler.handle(event.error, {
      showMessage: true,
      logError: true
    });
  });
}
