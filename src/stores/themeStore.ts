import { ref, watch, computed } from 'vue';
import { defineStore } from 'pinia';
import { theme } from 'ant-design-vue';

export type ThemeMode = 'light' | 'dark';

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>('light');

  const isDark = computed(() => mode.value === 'dark');

  const antTheme = computed(() => ({
    token: {
      colorPrimary: '#5e6ad2',
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      colorError: '#ef4444',
      colorInfo: '#5e6ad2',
      colorTextBase: '#1e293b',
      colorBgBase: '#ffffff',
      borderRadius: 6,
    },
    algorithm: isDark.value ? theme.darkAlgorithm : undefined,
  }));

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
    } else {
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
