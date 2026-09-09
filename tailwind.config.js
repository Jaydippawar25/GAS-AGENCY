/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gas: {
          purple: '#6C5CE7',
          purpleDark: '#4834D4',
          purpleLight: '#A29BFE',
          pink: '#FD79A8',
          pinkDark: '#E84393',
          navy: '#2D3436',
          red: '#D32F2F',
          bg: '#F3F4F9',
          card: '#FFFFFF',
          border: '#E8ECEF',
          text: '#2D3436',
          muted: '#636E72',
        },
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(108, 92, 231, 0.08)',
        'card': '0 4px 20px 0 rgba(0, 0, 0, 0.04)',
        'purple-glow': '0 10px 25px -5px rgba(108, 92, 231, 0.4)',
        'pink-glow': '0 10px 25px -5px rgba(253, 121, 168, 0.4)',
      }
    },
  },
  plugins: [],
};
