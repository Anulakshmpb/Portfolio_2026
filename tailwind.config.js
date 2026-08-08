/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        brand: {
          orange: '#ea580c',
          amber:  '#f59e0b',
          dark:   '#050505',
        },
      },
      fontFamily: {
        sans:    ['Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':    'spin 8s linear infinite',
        'metal-sweep':  'metalSweep 5s ease-in-out infinite',
        'aurora-drift': 'auroraDrift1 15s ease-in-out infinite',
      },
      keyframes: {
        metalSweep: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%':      { 'background-position': '100% 50%' },
        },
        auroraDrift1: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)',       opacity: '0.65' },
          '33%':      { transform: 'translate(50px,-35px) scale(1.18)', opacity: '0.85' },
          '66%':      { transform: 'translate(-22px,25px) scale(0.88)', opacity: '0.5' },
        },
      },
      gridTemplateColumns: {
        'hero': '55% 45%',
      },
      backgroundSize: {
        '250': '250% 100%',
        '300': '300% 300%',
      },
    },
  },
  plugins: [],
}
