import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type ThemeType = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  background: string;
  text: string;
  border: string;
  card: string;
  sidebar: string;
  header: string;
}

const lightTheme: ThemeConfig = {
  primary: '#409EFF',
  secondary: '#6C757D',
  success: '#67C23A',
  warning: '#E6A23C',
  danger: '#F56C6C',
  info: '#909399',
  background: '#F5F7FA',
  text: '#303133',
  border: '#DCDFE6',
  card: '#FFFFFF',
  sidebar: '#FFFFFF',
  header: '#FFFFFF'
};

const darkTheme: ThemeConfig = {
  primary: '#409EFF',
  secondary: '#909399',
  success: '#67C23A',
  warning: '#E6A23C',
  danger: '#F56C6C',
  info: '#909399',
  background: '#1F1F1F',
  text: '#E4E7ED',
  border: '#303030',
  card: '#2C2C2C',
  sidebar: '#2C2C2C',
  header: '#2C2C2C'
};

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeType>('light');
  const isDark = ref(false);
  
  // 计算当前主题配置
  const currentThemeConfig = computed<ThemeConfig>(() => {
    return isDark.value ? darkTheme : lightTheme;
  });
  
  // 初始化主题
  const initTheme = () => {
    // 从localStorage获取主题设置
    const savedTheme = localStorage.getItem('theme') as ThemeType | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // 默认使用系统主题
      setTheme('system');
    }
  };
  
  // 设置主题
  const setTheme = (newTheme: ThemeType) => {
    theme.value = newTheme;
    
    if (newTheme === 'system') {
      // 检测系统主题
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      isDark.value = prefersDark;
    } else {
      isDark.value = newTheme === 'dark';
    }
    
    // 应用主题
    applyTheme();
    
    // 保存到localStorage
    localStorage.setItem('theme', newTheme);
  };
  
  // 应用主题
  const applyTheme = () => {
    const config = currentThemeConfig.value;
    
    // 设置CSS变量
    const root = document.documentElement;
    Object.entries(config).forEach(([key, value]) => {
      root.style.setProperty(`--el-color-${key}`, value);
    });
    
    // 设置body背景和文字颜色
    document.body.style.backgroundColor = config.background;
    document.body.style.color = config.text;
    
    // 添加/移除dark类
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // 监听系统主题变化
  const setupSystemThemeListener = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme.value === 'system') {
        isDark.value = mediaQuery.matches;
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  };
  
  return {
    theme,
    isDark,
    currentThemeConfig,
    initTheme,
    setTheme,
    applyTheme,
    setupSystemThemeListener
  };
}, {
  persist: {
    key: 'theme-store',
    storage: localStorage,
    paths: ['theme']
  }
});
