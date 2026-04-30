/**
 * 用户认证服务
 * 处理用户登录、登出和认证状态管理
 */
import { apiService } from './apiService';

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
 * 认证服务类
 */
export class AuthService {
  /** 认证令牌 */
  private token = '';
  /** 当前用户信息 */
  private user: User | null = null;
  /** 认证状态 */
  private authenticated = false;

  /**
   * 用户登录
   * @param username - 用户名
   * @param password - 密码
   * @returns 登录结果，包含成功状态和错误信息（如果失败）
   */
  async login(username: string, password: string) {
    try {
      const response = await apiService.post<{ token: string; user: User }>('auth/login', {
        username,
        password,
      });

      if (response.code === 0 && response.data) {
        const { token: newToken, user: newUser } = response.data;
        this.token = newToken;
        this.user = newUser;
        this.authenticated = true;
        return { success: true };
      } else {
        return { success: false, error: response.message || '登录失败，请重试' };
      }
    } catch (err) {
      return { success: false, error: err };
    }
  }

  /**
   * 用户登出
   */
  async logout() {
    try {
      await apiService.post('auth/logout', {});
    } catch (e) {
      console.error('Logout API call failed:', e);
    }
    this.token = '';
    this.user = null;
    this.authenticated = false;
  }

  /**
   * 获取认证令牌
   * @returns 认证令牌字符串
   */
  getToken() {
    return this.token;
  }

  /**
   * 获取当前用户信息
   * @returns 用户信息对象或null
   */
  getUser() {
    return this.user;
  }

  /**
   * 检查是否已认证
   * @returns 认证状态
   */
  isAuthenticated() {
    return this.authenticated;
  }

  /**
   * 设置认证令牌
   * @param token - 新的认证令牌
   */
  setToken(token: string) {
    this.token = token;
  }

  /**
   * 设置用户信息
   * @param user - 用户信息对象或null
   */
  setUser(user: User | null) {
    this.user = user;
  }

  /**
   * 设置认证状态
   * @param authenticated - 认证状态
   */
  setIsAuthenticated(authenticated: boolean) {
    this.authenticated = authenticated;
  }
}

/**
 * 认证服务实例
 */
export const authService = new AuthService();
