/**
 * API服务
 * 封装HTTP请求方法，提供统一的API调用接口
 */
import { commonRequest } from '../api/request';

/**
 * API服务类
 */
export class ApiService {
  /**
   * 发送API请求
   * @template T - 返回数据类型
   * @param tradeName - 接口名称
   * @param params - 请求参数
   * @returns Promise<T> - 返回数据
   * @throws 当请求失败时抛出错误
   */
  async request<T = any>(tradeName: string, params: any = {}) {
    try {
      const response = await commonRequest<T>({ tradeName, params });
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * 发送GET请求
   * @template T - 返回数据类型
   * @param tradeName - 接口名称
   * @param params - 请求参数
   * @returns Promise<T> - 返回数据
   */
  get<T = any>(tradeName: string, params: any = {}) {
    return this.request<T>(tradeName, params);
  }

  /**
   * 发送POST请求
   * @template T - 返回数据类型
   * @param tradeName - 接口名称
   * @param params - 请求参数
   * @returns Promise<T> - 返回数据
   */
  post<T = any>(tradeName: string, params: any = {}) {
    return this.request<T>(tradeName, params);
  }
}

/**
 * API服务实例
 */
export const apiService = new ApiService();
