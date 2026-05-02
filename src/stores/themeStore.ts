import { ref, watch, computed } from 'vue';
import { defineStore } from 'pinia';

export type ThemeMode = 'light' | 'dark';

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>('light');

  const isDark = computed(() => mode.value === 'dark');

  const antTheme = computed(() => ({
    token: {
      colorPrimary: isDark.value ? '#818cf8' : '#5e6ad2',
      colorSuccess: isDark.value ? '#34d399' : '#10b981',
      colorWarning: isDark.value ? '#fbbf24' : '#f59e0b',
      colorError: isDark.value ? '#f87171' : '#ef4444',
      colorInfo: isDark.value ? '#818cf8' : '#5e6ad2',
      colorTextBase: isDark.value ? '#f1f5f9' : '#1e293b',
      colorBgBase: isDark.value ? '#0f172a' : '#ffffff',
      colorBorder: isDark.value ? '#475569' : '#e2e8f0',
      borderRadius: 6,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    algorithm: isDark.value ? theme.darkAlgorithm : undefined,
    components: {
      Menu: {
        darkItemColor: isDark.value ? '#94a3b8' : '#64748b',
        darkItemHoverColor: isDark.value ? '#f1f5f9' : '#1e293b',
        darkItemSelectedColor: isDark.value ? '#818cf8' : '#5e6ad2',
        darkSubMenuItemBg: isDark.value ? '#1e293b' : '#ffffff',
        darkItemBg: isDark.value ? '#1e293b' : '#ffffff',
      },
      Table: {
        headerBg: isDark.value ? '#334155' : '#f8fafc',
        headerColor: isDark.value ? '#f1f5f9' : '#1e293b',
        rowHoverBg: isDark.value ? '#334155' : '#f8fafc',
        borderColor: isDark.value ? '#475569' : '#e2e8f0',
      },
      Card: {
        colorBgContainer: isDark.value ? '#1e293b' : '#ffffff',
      },
      Modal: {
        contentBg: isDark.value ? '#1e293b' : '#ffffff',
        headerBg: isDark.value ? '#1e293b' : '#ffffff',
      },
      Input: {
        colorBgContainer: isDark.value ? '#1e293b' : '#ffffff',
        colorBorder: isDark.value ? '#475569' : '#e2e8f0',
        activeBorderColor: isDark.value ? '#818cf8' : '#5e6ad2',
        hoverBorderColor: isDark.value ? '#818cf8' : '#5e6ad2',
      },
      Select: {
        colorBgContainer: isDark.value ? '#1e293b' : '#ffffff',
        colorBorder: isDark.value ? '#475569' : '#e2e8f0',
        optionSelectedBg: isDark.value ? '#334155' : '#f1f5f9',
      },
      Button: {
        defaultBg: isDark.value ? '#1e293b' : '#ffffff',
        defaultBorderColor: isDark.value ? '#475569' : '#e2e8f0',
        defaultColor: isDark.value ? '#f1f5f9' : '#1e293b',
      },
      Dropdown: {
        colorBgElevated: isDark.value ? '#1e293b' : '#ffffff',
      },
      Pagination: {
        itemBg: isDark.value ? '#1e293b' : '#ffffff',
        itemBorderColor: isDark.value ? '#475569' : '#e2e8f0',
      },
      Breadcrumb: {
        itemColor: isDark.value ? '#94a3b8' : '#64748b',
        lastItemColor: isDark.value ? '#f1f5f9' : '#1e293b',
        linkColor: isDark.value ? '#94a3b8' : '#64748b',
        linkHoverColor: isDark.value ? '#818cf8' : '#5e6ad2',
      },
    },
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
