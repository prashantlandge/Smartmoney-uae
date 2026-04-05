/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1ABC9C',
          'primary-50': '#E8FAF6',
          'primary-100': '#C6F3E8',
          'primary-200': '#7AE8C9',
          'primary-300': '#15C39E',
          'primary-400': '#1ABC9C',
          'primary-500': '#1ABC9C',
          'primary-600': '#10AD8E',
          'primary-700': '#0E9A7E',
          'primary-800': '#0B7A64',
          'primary-900': '#085A49',
          nav: '#5271FF',
          'nav-hover': '#617BF6',
          'nav-dark': '#3D5BF0',
          dark: '#34495E',
          'dark-50': '#F8F9FA',
          'dark-100': '#E2E8F0',
        },
        surface: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          sky: '#EFF5FC',
        },
        accent: {
          DEFAULT: '#1465C9',
          hover: '#1058B0',
          light: '#EBF2FC',
        },
        cta: {
          DEFAULT: '#1ABC9C',
          hover: '#10AD8E',
        },
        success: { DEFAULT: '#059669', light: '#ECFDF5', dark: '#065F46' },
        warning: { DEFAULT: '#D97706', light: '#FFFBEB', dark: '#92400E' },
        error: { DEFAULT: '#DC2626', light: '#FEF2F2', dark: '#991B1B' },
        info: { DEFAULT: '#2563EB', light: '#EFF6FF', dark: '#1E40AF' },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans Arabic"', 'sans-serif'],
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
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
        'elevated': '0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.04)',
        'nav': '0 2px 4px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        'card': '8px',
        'button': '6px',
        'badge': '4px',
        'pill': '9999px',
      },
      maxWidth: {
        'content-sm': '640px',
        'content-md': '768px',
        'content-lg': '1024px',
        'content-xl': '1200px',
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
