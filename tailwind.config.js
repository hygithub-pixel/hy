/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
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
        background: {
          base: 'var(--ant-bg-color)',
          page: 'var(--ant-bg-color-page)',
          container: 'var(--ant-bg-color-container)',
          elevated: 'var(--ant-bg-color-elevated)',
          layout: 'var(--ant-bg-color-layout)',
          hover: 'var(--ant-item-hover-bg)',
        },
        foreground: {
          DEFAULT: 'var(--ant-text-color)',
          secondary: 'var(--ant-text-color-secondary)',
          disabled: 'var(--ant-text-color-disabled)',
        },
        border: {
          DEFAULT: 'var(--ant-border-color)',
          secondary: 'var(--ant-border-color-secondary)',
        },
        shadow: 'var(--ant-box-shadow)',
      },
      borderRadius: {
        DEFAULT: '6px',
      },
      fontFamily: {
        sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
    },
  },
  plugins: [],
}
