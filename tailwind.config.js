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
          light: 'var(--ant-primary-color-light)',
          dark: 'var(--ant-primary-color-dark)',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: {
          DEFAULT: 'var(--ant-bg-color)',
          page: 'var(--ant-bg-color-page)',
        },
        foreground: {
          DEFAULT: 'var(--ant-text-color)',
          secondary: 'var(--ant-text-color-secondary)',
          tertiary: 'var(--ant-text-color-tertiary)',
          disabled: 'var(--ant-text-color-disabled)',
        },
        border: {
          DEFAULT: 'var(--ant-border-color)',
          secondary: 'var(--ant-border-color-secondary)',
        },
        card: {
          DEFAULT: 'var(--ant-bg-color-container)',
          foreground: 'var(--ant-text-color)',
        },
        input: {
          DEFAULT: 'var(--ant-bg-color)',
          border: 'var(--ant-border-color)',
        },
        ring: 'var(--ant-primary-color)',
      },
    },
  },
  plugins: [],
}
