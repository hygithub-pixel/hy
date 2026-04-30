import { defineConfig, presetUno, presetAttributify } from 'unocss';

export default defineConfig({
  presets: [presetUno(), presetAttributify()],
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-start': 'flex items-center justify-start',
    'flex-end': 'flex items-center justify-end',
    'sidebar-transition': 'transition-all duration-300 ease-out',
    'page-header': 'text-2xl font-bold text-text-primary mb-2',
    'page-subtitle': 'text-base text-text-secondary',
    'card-header': 'flex items-center justify-between',
    'card-title': 'text-lg font-semibold text-text-primary',
    'stat-card':
      'p-lg bg-bg-surface rounded-lg shadow-sm hover:shadow-md transition-all duration-200',
    'stat-card-icon': 'w-14 h-14 rounded-md flex-center text-white',
    'stat-card-title': 'text-sm text-text-secondary mb-1',
    'stat-card-value': 'text-2xl font-bold text-text-primary font-tabular-nums',
    'stat-card-trend': 'flex items-center gap-1 text-sm font-medium',
    'trend-up': 'text-success',
    'trend-down': 'text-danger',
    'chart-card': 'border border-border rounded-lg',
    'amount-text': 'font-semibold text-text-primary font-tabular-nums',
    'user-menu-trigger':
      'flex items-center gap-2 px-3 py-2 rounded-md hover:bg-bg-muted transition-all duration-150',
    'action-btn':
      'w-10 h-10 text-text-secondary hover:bg-bg-muted hover:text-text-primary transition-all duration-150',
    'toggle-btn':
      'w-10 h-10 text-text-secondary hover:bg-bg-muted hover:text-text-primary transition-all duration-150',
    'search-input': 'w-full',
    'time-select': 'w-32',
    breadcrumb: 'text-sm',
    'dropdown-menu': 'p-1 rounded-lg shadow-lg border border-border',
    'dropdown-item':
      'flex items-center gap-2 px-4 py-2 m-1 rounded-sm text-text-primary hover:bg-bg-muted transition-all duration-150',
    'dropdown-icon': 'text-text-secondary',
    'view-all': 'justify-center text-primary font-medium',
    'notification-item': 'flex items-start gap-2 w-full',
    'notification-icon': 'flex-shrink-0 mt-0.5',
    'notification-content': 'flex-1 min-w-0',
    'notification-title': 'text-sm text-text-primary leading-5',
    'notification-time': 'text-xs text-text-secondary mt-1',
    'orders-table': 'rounded-md',
  },
  theme: {
    colors: {
      primary: {
        DEFAULT: '#5e6ad2',
        light: '#818cf8',
        dark: '#4c51bf',
      },
      success: {
        DEFAULT: '#10b981',
        light: '#34d399',
      },
      warning: {
        DEFAULT: '#f59e0b',
        light: '#fbbf24',
      },
      danger: {
        DEFAULT: '#ef4444',
        light: '#f87171',
      },
      text: {
        primary: '#1e293b',
        secondary: '#64748b',
        disabled: '#94a3b8',
      },
      bg: {
        page: '#f8fafc',
        surface: '#ffffff',
        muted: '#f1f5f9',
      },
      border: {
        DEFAULT: '#e2e8f0',
        light: '#cbd5e1',
      },
    },
    boxShadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
    borderRadius: {
      sm: '6px',
      md: '8px',
      lg: '12px',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
  },
  rules: [
    ['w-260px', { width: '260px' }],
    ['w-80px', { width: '80px' }],
    ['ml-260px', { marginLeft: '260px' }],
    ['ml-80px', { marginLeft: '80px' }],
    ['max-w-400px', { 'max-width': '400px' }],
    ['z-1000', { zIndex: '1000' }],
    ['h-18', { height: '72px' }],
    ['duration-250', { 'transition-duration': '250ms' }],
    ['font-tabular-nums', { 'font-variant-numeric': 'tabular-nums' }],
    ['content-auto', { 'content-visibility': 'auto' }],
    ['scrollbar-hide', { 'scrollbar-width': 'none', '-ms-overflow-style': 'none' }],
    ['scrollbar-hide::-webkit-scrollbar', { display: 'none' }],
  ],
});
