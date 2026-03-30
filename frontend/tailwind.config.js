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
          primary: '#00805E',    // UAE green
          secondary: '#C8102E',  // UAE red
          gold: '#B8860B',       // Gold accent
          dark: '#1A1A2E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
