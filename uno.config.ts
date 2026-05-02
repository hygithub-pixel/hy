import { defineConfig, presetUno, presetAttributify, transformerVariantGroup } from 'unocss';

export default defineConfig({
  presets: [presetUno(), presetAttributify()],
  transformers: [transformerVariantGroup()],
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-start': 'flex items-center justify-start',
    'flex-end': 'flex items-center justify-end',
  },
  theme: {
    colors: {
      primary: {
        DEFAULT: 'var(--ant-primary-color)',
        hover: 'var(--ant-primary-color-hover)',
        active: 'var(--ant-primary-color-active)',
      },
      success: 'var(--ant-success-color)',
      warning: 'var(--ant-warning-color)',
      error: 'var(--ant-error-color)',
      info: 'var(--ant-info-color)',
    },
  },
  rules: [
    ['h-18', { height: '72px' }],
    ['font-tabular-nums', { 'font-variant-numeric': 'tabular-nums' }],
    ['scrollbar-hide', { 'scrollbar-width': 'none', '-ms-overflow-style': 'none' }],
    ['scrollbar-hide::-webkit-scrollbar', { display: 'none' }],
  ],
});
