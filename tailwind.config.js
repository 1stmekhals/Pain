/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'twinkle-slow': 'twinkle-slow 4s ease-in-out infinite',
        'twinkle-medium': 'twinkle-medium 3s ease-in-out infinite',
        'twinkle-fast': 'twinkle-fast 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};