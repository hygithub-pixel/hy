import { defineConfig, presetUno, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify()
  ],
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-start': 'flex items-center justify-start',
    'flex-end': 'flex items-center justify-end',
    'sidebar-transition': 'transition-all duration-300 ease-out'
  },
  theme: {
    colors: {
      primary: '#6366f1',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444'
    }
  },
  rules: [
    ['w-260px', { width: '260px' }],
    ['w-80px', { width: '80px' }],
    ['ml-260px', { marginLeft: '260px' }],
    ['ml-80px', { marginLeft: '80px' }],
    ['max-w-400px', { maxWidth: '400px' }],
    ['z-1000', { zIndex: '1000' }],
    ['h-18', { height: '72px' }],
    ['duration-250', { transitionDuration: '250ms' }]
  ]
})
