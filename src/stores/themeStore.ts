import { ref, watch, computed } from 'vue';
import { defineStore } from 'pinia';
import { theme } from 'ant-design-vue';

export type ThemeMode = 'light' | 'dark';

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>('light');

  const isDark = computed(() => mode.value === 'dark');

  const antTheme = computed(() => {
    const lightToken = {
      colorPrimary: '#5e6ad2',
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      colorError: '#ef4444',
      colorInfo: '#5e6ad2',
      colorTextBase: '#1e293b',
      colorBgBase: '#ffffff',
      colorBgContainer: '#ffffff',
      colorBgElevated: '#ffffff',
      colorBgLayout: '#f8fafc',
      colorBgPage: '#f8fafc',
      colorBorder: '#e2e8f0',
      colorBorderSecondary: '#f1f5f9',
      borderRadius: 6,
    };

    const darkToken = {
      colorPrimary: '#818cf8',
      colorSuccess: '#34d399',
      colorWarning: '#fbbf24',
      colorError: '#f87171',
      colorInfo: '#818cf8',
      colorTextBase: '#f1f5f9',
      colorBgBase: '#1e293b',
      colorBgContainer: '#1e293b',
      colorBgElevated: '#334155',
      colorBgLayout: '#0f172a',
      colorBgPage: '#0f172a',
      colorBorder: '#475569',
      colorBorderSecondary: '#334155',
      borderRadius: 6,
    };

    return {
      token: isDark.value ? darkToken : lightToken,
      algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
    };
  });

  const toggle = () => {
    mode.value = isDark.value ? 'light' : 'dark';
  };

  const setMode = (newMode: ThemeMode) => {
    mode.value = newMode;
  };

  const init = () => {
    const saved = localStorage.getItem('theme-mode') as ThemeMode | null;
    if (saved) {
      mode.value = saved;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      mode.value = prefersDark ? 'dark' : 'light';
    }
    applyTheme();
  };

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme-mode', mode.value);
  };

  watch(mode, () => {
    applyTheme();
  });

  return {
    mode,
    isDark,
    antTheme,
    toggle,
    setMode,
    init,
  };
});
