import { ref } from 'vue';
import { apiService } from '../services/apiService';
import { notificationService } from '../services/notificationService';

/**
 * API请求配置选项
 */
interface UseApiOptions {
  /** 是否显示错误通知，默认true */
  showError?: boolean;
  /** 是否显示成功通知，默认false */
  showSuccess?: boolean;
  /** 成功通知消息，默认'操作成功' */
  successMessage?: string;
  /** 错误通知消息，默认'操作失败' */
  errorMessage?: string;
}

/**
 * API请求组合函数
 * @template T - 返回数据类型
 * @param options - 配置选项
 * @returns API请求相关状态和方法
 * @example
 * ```typescript
 * const { loading, data, error, post } = useApi<User>();
 * 
 * const fetchUser = async () => {
 *   const user = await post('user/get', { id: 1 });
 *   if (user) {
 *     console.log('获取用户成功:', user);
 *   }
 * };
 * ```
 */
export function useApi<T = any>(options: UseApiOptions = {}) {
  const {
    showError = true,
    showSuccess = false,
    successMessage = '操作成功',
    errorMessage = '操作失败'
  } = options;

  /** 加载状态 */
  const loading = ref(false);
  /** 错误信息 */
  const error = ref<string | null>(null);
  /** 返回数据 */
  const data = ref<T | null>(null);

  /**
   * 发送API请求
   * @param tradeName - 接口名称
   * @param params - 请求参数
   * @param method - 请求方法，默认post
   * @returns Promise<T | null> - 返回数据或null
   */
  const request = async (
    tradeName: string,
    params: any = {},
    method: 'get' | 'post' = 'post'
  ): Promise<T | null> => {
    loading.value = true;
    error.value = null;
    data.value = null;

    try {
      const response = method === 'get'
        ? await apiService.get(tradeName, params)
        : await apiService.post(tradeName, params);

      if (response.code === 0) {
        data.value = response.data;
        if (showSuccess) {
          notificationService.success(successMessage);
        }
        return response.data;
      } else {
        const msg = response.message || errorMessage;
        error.value = msg;
        if (showError) {
          notificationService.error(msg);
        }
        return null;
      }
    } catch (err) {
      const msg = errorMessage;
      error.value = msg;
      if (showError) {
        notificationService.error(msg);
      }
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 发送GET请求
   * @param tradeName - 接口名称
   * @param params - 请求参数
   * @returns Promise<T | null> - 返回数据或null
   */
  const get = (tradeName: string, params: any = {}) => {
    return request(tradeName, params, 'get');
  };

  /**
   * 发送POST请求
   * @param tradeName - 接口名称
   * @param params - 请求参数
   * @returns Promise<T | null> - 返回数据或null
   */
  const post = (tradeName: string, params: any = {}) => {
    return request(tradeName, params, 'post');
  };

  /**
   * 重置状态
   */
  const reset = () => {
    loading.value = false;
    error.value = null;
    data.value = null;
  };

  return {
    /** 加载状态 */
    loading,
    /** 错误信息 */
    error,
    /** 返回数据 */
    data,
    /** 发送API请求 */
    request,
    /** 发送GET请求 */
    get,
    /** 发送POST请求 */
    post,
    /** 重置状态 */
    reset
  };
}
