import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  CancelTokenSource,
} from 'axios';
import { showMessage } from '@/utils/message';
import { apiCache, cacheUtils } from '@/utils/cache';
import { debounce, throttle } from '@/utils/debounceThrottle';
import { performanceMonitor } from '@/utils/performance';

interface RequestConfig extends AxiosRequestConfig {
  retryCount?: number;
  retryDelay?: number;
  __retryCount?: number;
}

interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

interface RequestExecutor<T> {
  (): Promise<T>;
}

interface CommonRequestParams {
  tradeName: string;
  params?: Record<string, any>;
  debounce?: number;
  throttle?: number;
  cache?: boolean;
  cacheExpiry?: number;
}

interface CommonRequestDoParams extends CommonRequestParams {
  file: File | File[];
  fileFieldName?: string;
}

const pendingRequests: Map<string, CancelTokenSource> = new Map();

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const generateRequestKey = (config: RequestConfig): string => {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params || {}), JSON.stringify(data || {})].join('&');
};

const addPendingRequest = (config: RequestConfig) => {
  const key = generateRequestKey(config);
  if (!pendingRequests.has(key)) {
    const source = axios.CancelToken.source();
    config.cancelToken = source.token;
    pendingRequests.set(key, source);
  }
};

const removePendingRequest = (config: RequestConfig) => {
  const key = generateRequestKey(config);
  if (pendingRequests.has(key)) {
    const source = pendingRequests.get(key);
    source?.cancel();
    pendingRequests.delete(key);
  }
};

const retryRequest = (error: AxiosError) => {
  const config = error.config as RequestConfig;
  if (!config || !config.retryCount) {
    return Promise.reject(error);
  }

  config.__retryCount = config.__retryCount || 0;

  if (config.__retryCount >= config.retryCount) {
    return Promise.reject(error);
  }

  config.__retryCount += 1;

  const delay = config.retryDelay || 1000;

  return new Promise(resolve => {
    setTimeout(() => resolve(instance(config)), delay);
  });
};

instance.interceptors.request.use(
  config => {
    const requestConfig = config as RequestConfig;

    removePendingRequest(requestConfig);
    addPendingRequest(requestConfig);

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    performanceMonitor.startMeasure(`api-${config.url}`);

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as RequestConfig;
    removePendingRequest(config);

    performanceMonitor.endMeasure(`api-${config.url}`);

    const data = response.data as ApiResponse;
    if (data.code !== 0) {
      showMessage.error(data.message || '请求失败');
      return Promise.reject(new Error(data.message || '请求失败'));
    }
    return response;
  },
  (error: AxiosError) => {
    const config = error.config as RequestConfig;
    if (config) {
      removePendingRequest(config);
      performanceMonitor.endMeasure(`api-${config.url}`);
    }

    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.message.includes('timeout')) {
      showMessage.error('请求超时，请稍后再试');
    } else if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          showMessage.error('未授权，请重新登录');
          break;
        case 403:
          showMessage.error('拒绝访问');
          break;
        case 404:
          showMessage.error('请求地址不存在');
          break;
        case 500:
          showMessage.error('服务器内部错误');
          break;
        default:
          showMessage.error(`请求失败: ${error.message}`);
      }
    } else {
      showMessage.error('网络错误，请检查网络连接');
    }

    return retryRequest(error);
  }
);

// 存储防抖和节流函数的映射，避免重复创建
const debounceMap = new Map<string, (...args: any[]) => Promise<any>>();
const throttleMap = new Map<string, (...args: any[]) => Promise<any>>();

const executeRequest = <T>(
  key: string,
  requestExecutor: RequestExecutor<T>,
  debounceDelay?: number,
  throttleDelay?: number
): Promise<T> => {
  let executor = requestExecutor;

  // 应用防抖
  if (debounceDelay && debounceDelay > 0) {
    if (!debounceMap.has(key)) {
      // 创建一个防抖版本的执行器
      const debouncedExecutor = debounce(async () => {
        return await requestExecutor();
      }, debounceDelay);
      debounceMap.set(key, debouncedExecutor);
    }
    executor = debounceMap.get(key) as RequestExecutor<T>;
  }

  // 应用节流
  if (throttleDelay && throttleDelay > 0) {
    if (!throttleMap.has(key)) {
      // 创建一个节流版本的执行器
      const throttledExecutor = throttle(async () => {
        return await requestExecutor();
      }, throttleDelay);
      throttleMap.set(key, throttledExecutor);
    }
    executor = throttleMap.get(key) as RequestExecutor<T>;
  }

  return executor();
};

export const commonRequest = async <T = any>(
  params: CommonRequestParams
): Promise<ApiResponse<T>> => {
  const {
    tradeName,
    params: requestParams,
    debounce,
    throttle,
    cache = false,
    cacheExpiry,
  } = params;
  const requestKey = cacheUtils.generateKey(tradeName, requestParams);

  const requestExecutor: RequestExecutor<ApiResponse<T>> = async () => {
    const response = await instance.post<ApiResponse<T>>(tradeName, requestParams);
    return response.data;
  };

  if (cache) {
    // 检查缓存
    const cachedData = apiCache.get(requestKey);
    if (cachedData) {
      // 如果从缓存获取，需要手动关闭loading

      return cachedData;
    }

    // 从数据源获取
    return executeRequest(requestKey, requestExecutor, debounce, throttle).then(data => {
      apiCache.set(requestKey, data, cacheExpiry ? { expiry: cacheExpiry } : undefined);
      return data;
    });
  }

  return executeRequest(requestKey, requestExecutor, debounce, throttle);
};

export const commonRequestDo = async <T = any>(
  params: CommonRequestDoParams
): Promise<ApiResponse<T>> => {
  const {
    tradeName,
    params: requestParams,
    file,
    fileFieldName = 'file',
    debounce,
    throttle,
    cache = false,
    cacheExpiry,
  } = params;

  const formData = new FormData();

  if (Array.isArray(file)) {
    file.forEach((f, index) => {
      formData.append(`${fileFieldName}${index}`, f);
    });
  } else {
    formData.append(fileFieldName, file);
  }

  if (requestParams) {
    Object.entries(requestParams).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
  }

  const requestKey = cacheUtils.generateKey(
    tradeName,
    requestParams,
    Array.isArray(file) ? file.length : 1
  );

  const requestExecutor: RequestExecutor<ApiResponse<T>> = async () => {
    const response = await instance.post<ApiResponse<T>>(tradeName, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };

  if (cache) {
    // 检查缓存
    const cachedData = apiCache.get(requestKey);
    if (cachedData) {
      // 如果从缓存获取，需要手动关闭loading

      return cachedData;
    }

    // 从数据源获取
    return executeRequest(requestKey, requestExecutor, debounce, throttle).then(data => {
      apiCache.set(requestKey, data, cacheExpiry ? { expiry: cacheExpiry } : undefined);
      return data;
    });
  }

  return executeRequest(requestKey, requestExecutor, debounce, throttle);
};

export const request = {
  get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return instance.get(url, config).then(response => response.data);
  },
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return instance.post(url, data, config).then(response => response.data);
  },
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return instance.put(url, data, config).then(response => response.data);
  },
  delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return instance.delete(url, config).then(response => response.data);
  },
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return instance.patch(url, data, config).then(response => response.data);
  },
};

export default request;
