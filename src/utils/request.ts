import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { loadSystemConfig } from './configScanner';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, any>;
  data?: Record<string, any>;
}

const createRequest = async () => {
  const system = await loadSystemConfig();
  
  const instance = axios.create({
    baseURL: system.api.baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const { code, message } = response.data;
      if (code !== 200) {
        console.error('API Error:', message);
        return Promise.reject(new Error(message));
      }
      return response.data;
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  return instance;
};

let requestInstance: ReturnType<typeof createRequest> | null = null;

export const getRequest = async () => {
  if (!requestInstance) {
    requestInstance = createRequest();
  }
  return requestInstance;
};

export const request = async <T = any>(config: RequestConfig): Promise<ApiResponse<T>> => {
  const instance = await getRequest();
  return instance.request(config) as Promise<ApiResponse<T>>;
};

export const get = <T = any>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> => {
  return request<T>({ url, method: 'GET', params });
};

export const post = <T = any>(url: string, data?: Record<string, any>): Promise<ApiResponse<T>> => {
  return request<T>({ url, method: 'POST', data });
};

export const put = <T = any>(url: string, data?: Record<string, any>): Promise<ApiResponse<T>> => {
  return request<T>({ url, method: 'PUT', data });
};

export const del = <T = any>(url: string, data?: Record<string, any>): Promise<ApiResponse<T>> => {
  return request<T>({ url, method: 'DELETE', data });
};
