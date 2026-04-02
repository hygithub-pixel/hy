import { defineStore } from 'pinia';
import { ref } from 'vue';
import { eventBus, AppEvents } from '../utils/eventBus';
import { commonRequest } from '../api/request';

interface User {
  id: string;
  username: string;
  avatar?: string;
  role?: string;
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('');
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const batchUpdate = (updates: Partial<{
    token: string;
    user: User | null;
    isAuthenticated: boolean;
  }>) => {
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

  const login = async (username: string, password: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await commonRequest<{ token: string; user: User }>({
        tradeName: 'auth/login',
        params: { username, password }
      });
      
      if (response.code === 0 && response.data) {
        const { token: newToken, user: newUser } = response.data;
        batchUpdate({
          token: newToken,
          user: newUser,
          isAuthenticated: true
        });
        localStorage.setItem('token', newToken);
        eventBus.emit(AppEvents.USER_LOGGED_IN, { user: newUser });
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

  const logout = async () => {
    try {
      await commonRequest({
        tradeName: 'auth/logout',
        params: {}
      });
    } catch (e) {
      console.error('Logout API call failed:', e);
    }
    batchUpdate({
      token: '',
      user: null,
      isAuthenticated: false
    });
    localStorage.removeItem('token');
    eventBus.emit(AppEvents.USER_LOGGED_OUT);
  };

  return {
    token,
    user,
    isAuthenticated,
    loading,
    error,
    batchUpdate,
    login,
    logout
  };
}, {
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['token', 'user', 'isAuthenticated']
  }
});
