import { computed } from 'vue';
import { useUserStore } from '../stores/userStore';
import { authService } from '../services/authService';

/**
 * 用户相关组合函数
 * @returns 用户相关状态和方法
 * @example
 * ```typescript
 * const { user, isAuthenticated, login, logout } = useUser();
 * 
 * const handleLogin = async () => {
 *   const result = await login('admin', 'password');
 *   if (result.success) {
 *     console.log('登录成功');
 *   }
 * };
 * ```
 */
export function useUser() {
  const userStore = useUserStore();

  /** 用户信息 */
  const user = computed(() => userStore.user);
  /** 认证令牌 */
  const token = computed(() => userStore.token);
  /** 是否已认证 */
  const isAuthenticated = computed(() => userStore.isAuthenticated);
  /** 加载状态 */
  const loading = computed(() => userStore.loading);
  /** 错误信息 */
  const error = computed(() => userStore.error);

  /**
   * 用户登录
   * @param username - 用户名
   * @param password - 密码
   * @returns 登录结果
   */
  const login = async (username: string, password: string) => {
    const result = await authService.login(username, password);
    if (result.success && result.success === true) {
      const userResult = await userStore.login(username, password);
      return userResult;
    }
    return result;
  };

  /**
   * 用户登出
   */
  const logout = async () => {
    await authService.logout();
    await userStore.logout();
  };

  /**
   * 检查用户是否拥有指定角色
   * @param role - 角色名称
   * @returns 是否拥有该角色
   */
  const hasRole = (role: string): boolean => {
    if (!user.value) return false;
    return user.value.role === role;
  };

  /**
   * 检查用户是否拥有指定角色之一
   * @param roles - 角色名称数组
   * @returns 是否拥有任一角色
   */
  const hasAnyRole = (roles: string[]): boolean => {
    if (!user.value) return false;
    return roles.includes(user.value.role || '');
  };

  return {
    /** 用户信息 */
    user,
    /** 认证令牌 */
    token,
    /** 是否已认证 */
    isAuthenticated,
    /** 加载状态 */
    loading,
    /** 错误信息 */
    error,
    /** 用户登录 */
    login,
    /** 用户登出 */
    logout,
    /** 检查用户是否拥有指定角色 */
    hasRole,
    /** 检查用户是否拥有指定角色之一 */
    hasAnyRole
  };
}
