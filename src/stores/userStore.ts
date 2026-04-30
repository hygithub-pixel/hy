/**
 * 用户状态管理
 * 处理用户认证状态、登录登出等功能
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '../services/apiService';

/**
 * 用户信息接口
 */
export interface User {
  /** 用户ID */
  id: string;
  /** 用户名 */
  username: string;
  /** 头像URL */
  avatar?: string;
  /** 用户角色 */
  role?: string;
}

/**
 * 用户状态Store
 */
export const useUserStore = defineStore(
  'user',
  () => {
    /** 认证令牌 */
    const token = ref<string>('');
    /** 当前用户信息 */
    const user = ref<User | null>(null);
    /** 认证状态 */
    const isAuthenticated = ref(false);
    /** 加载状态 */
    const loading = ref(false);
    /** 错误信息 */
    const error = ref<string | null>(null);

    /**
     * 批量更新用户状态
     * @param updates - 要更新的状态字段
     */
    const batchUpdate = (
      updates: Partial<{
        token: string;
        user: User | null;
        isAuthenticated: boolean;
      }>
    ) => {
      if (updates.token !== undefined) {
        token.value = updates.token;
      }
      if (updates.user !== undefined) {
        user.value = updates.user;
      }
      if (updates.isAuthenticated !== undefined) {
        isAuthenticated.value = updates.isAuthenticated;
      }
    };

    /**
     * 用户登录
     * @param username - 用户名
     * @param password - 密码
     * @returns 登录结果，包含成功状态和错误信息（如果失败）
     */
    const login = async (username: string, password: string) => {
      loading.value = true;
      error.value = null;
      try {
        const response = await apiService.post<{ token: string; user: User }>('auth/login', {
          username,
          password,
        });

        if (response.code === 0 && response.data) {
          const { token: newToken, user: newUser } = response.data;
          batchUpdate({
            token: newToken,
            user: newUser,
            isAuthenticated: true,
          });
          return { success: true };
        } else {
          error.value = response.message || '登录失败，请重试';
          return { success: false, error: response.message };
        }
      } catch (err) {
        error.value = '登录失败，请重试';
        return { success: false, error: err };
      } finally {
        loading.value = false;
      }
    };

    /**
     * 用户登出
     */
    const logout = async () => {
      try {
        await apiService.post('auth/logout', {});
      } catch (e) {
        console.error('Logout API call failed:', e);
      }
      batchUpdate({
        token: '',
        user: null,
        isAuthenticated: false,
      });
    };

    return {
      token,
      user,
      isAuthenticated,
      loading,
      error,
      batchUpdate,
      login,
      logout,
    };
  },
  {
    persist: {
      key: 'user-store',
      storage: localStorage,
      paths: ['token', 'user', 'isAuthenticated'],
    },
  }
);
