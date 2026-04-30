import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { apiService } from '@/services/apiService';

// 模拟apiService
vi.mock('@/services/apiService', () => ({
  apiService: {
    post: vi.fn(),
  },
}));

// 模拟localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

global.localStorage = mockLocalStorage as any;

describe('userStore', () => {
  let userStore: ReturnType<typeof useUserStore>;

  beforeEach(() => {
    // 创建新的pinia实例
    const pinia = createPinia();
    setActivePinia(pinia);
    
    // 重置mock
    vi.clearAllMocks();
    
    // 创建userStore实例
    userStore = useUserStore();
  });

  it('should initialize with default values', () => {
    expect(userStore.token).toBe('');
    expect(userStore.user).toBeNull();
    expect(userStore.isAuthenticated).toBe(false);
    expect(userStore.loading).toBe(false);
    expect(userStore.error).toBeNull();
  });

  it('should batch update state', () => {
    const updates = {
      token: 'test-token',
      user: { id: '1', username: 'test-user' },
      isAuthenticated: true,
    };

    userStore.batchUpdate(updates);

    expect(userStore.token).toBe('test-token');
    expect(userStore.user).toEqual({ id: '1', username: 'test-user' });
    expect(userStore.isAuthenticated).toBe(true);
  });

  it('should batch update only provided fields', () => {
    // 先设置初始值
    userStore.batchUpdate({
      token: 'initial-token',
      user: { id: '1', username: 'initial-user' },
      isAuthenticated: true,
    });

    // 只更新部分字段
    userStore.batchUpdate({
      token: 'new-token',
      isAuthenticated: false,
    });

    expect(userStore.token).toBe('new-token');
    expect(userStore.user).toEqual({ id: '1', username: 'initial-user' });
    expect(userStore.isAuthenticated).toBe(false);
  });

  it('should handle login successfully', async () => {
    const mockResponse = {
      code: 0,
      data: {
        token: 'test-token',
        user: { id: '1', username: 'test-user' },
      },
      message: '登录成功',
    };

    (apiService.post as vi.Mock).mockResolvedValue(mockResponse);

    const result = await userStore.login('test', 'password');

    expect(result).toEqual({ success: true });
    expect(userStore.token).toBe('test-token');
    expect(userStore.user).toEqual({ id: '1', username: 'test-user' });
    expect(userStore.isAuthenticated).toBe(true);
    expect(userStore.loading).toBe(false);
    expect(userStore.error).toBeNull();
  });

  it('should handle login failure', async () => {
    const mockResponse = {
      code: 1,
      message: '用户名或密码错误',
    };

    (apiService.post as vi.Mock).mockResolvedValue(mockResponse);

    const result = await userStore.login('test', 'wrong-password');

    expect(result).toEqual({ success: false, error: '用户名或密码错误' });
    expect(userStore.token).toBe('');
    expect(userStore.user).toBeNull();
    expect(userStore.isAuthenticated).toBe(false);
    expect(userStore.loading).toBe(false);
    expect(userStore.error).toBe('用户名或密码错误');
  });

  it('should handle login error', async () => {
    const mockError = new Error('网络错误');

    (apiService.post as vi.Mock).mockRejectedValue(mockError);

    const result = await userStore.login('test', 'password');

    expect(result).toEqual({ success: false, error: mockError });
    expect(userStore.token).toBe('');
    expect(userStore.user).toBeNull();
    expect(userStore.isAuthenticated).toBe(false);
    expect(userStore.loading).toBe(false);
    expect(userStore.error).toBe('登录失败，请重试');
  });

  it('should handle logout successfully', async () => {
    // 先设置登录状态
    userStore.batchUpdate({
      token: 'test-token',
      user: { id: '1', username: 'test-user' },
      isAuthenticated: true,
    });

    (apiService.post as vi.Mock).mockResolvedValue({ code: 0 });

    await userStore.logout();

    expect(userStore.token).toBe('');
    expect(userStore.user).toBeNull();
    expect(userStore.isAuthenticated).toBe(false);
  });

  it('should handle logout error gracefully', async () => {
    // 先设置登录状态
    userStore.batchUpdate({
      token: 'test-token',
      user: { id: '1', username: 'test-user' },
      isAuthenticated: true,
    });

    const mockError = new Error('网络错误');
    (apiService.post as vi.Mock).mockRejectedValue(mockError);

    // 模拟console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation();

    await userStore.logout();

    expect(userStore.token).toBe('');
    expect(userStore.user).toBeNull();
    expect(userStore.isAuthenticated).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Logout API call failed:', mockError);

    consoleSpy.mockRestore();
  });
});