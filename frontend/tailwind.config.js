/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a5f',
          50: '#eef4ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#172e4d',
          700: '#11233b',
          800: '#0c1929',
          900: '#070f1a',
          light: '#2563eb',
        },
        accent: {
          DEFAULT: '#0ea5e9',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        success: { DEFAULT: '#059669', light: '#ecfdf5', dark: '#065f46' },
        warning: { DEFAULT: '#f59e0b', light: '#fffbeb', dark: '#92400e' },
        error: { DEFAULT: '#dc2626', light: '#fef2f2', dark: '#991b1b' },
        info: { DEFAULT: '#2563eb', light: '#eff6ff', dark: '#1e40af' },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans Arabic"', '"Noto Sans Devanagari"', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.025em' }],
        'display-lg': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'heading-lg': ['1.25rem', { lineHeight: '1.3' }],
        'heading-md': ['1.125rem', { lineHeight: '1.35' }],
        'heading-sm': ['1rem', { lineHeight: '1.4' }],
        'body-lg': ['1rem', { lineHeight: '1.6' }],
        'body-md': ['0.9375rem', { lineHeight: '1.5' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'label': ['0.75rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0,0,0,0.05)',
        'card': '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 20px 25px -5px rgba(30,58,95,0.08), 0 8px 10px -6px rgba(30,58,95,0.04)',
        'elevated': '0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.04)',
        'nav': '0 2px 4px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        'card': '16px',
        'button': '8px',
        'badge': '4px',
        'pill': '9999px',
      },
      maxWidth: {
        'content-sm': '640px',
        'content-md': '768px',
        'content-lg': '1024px',
        'content-xl': '1280px',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
