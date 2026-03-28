/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        f1: {
          red: '#E10600',
          dark: '#15151E',
          gray: '#383B42',
          light: '#F0F0F0',
        },
        team: {
          mercedes: '#27F4D2',
          ferrari: '#E8002D',
          redbull: '#3671C6',
          mclaren: '#FF8000',
          aston: '#229971',
          alpine: '#0093CC',
          williams: '#64C4FF',
          Haas: '#B6BABD',
          kick: '#24E000',
          rb: '#6692FF',
        },
      },
      fontFamily: {
        f1: ['Orbitron', 'sans-serif'],
        body: ['Barlow Condensed', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
