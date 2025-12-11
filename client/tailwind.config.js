/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./public/admin.html",
  ],
  // Safelist commonly used dynamic classes
  safelist: [
    'bg-blue-600',
    'bg-blue-700', 
    'bg-green-600',
    'bg-green-700',
    'bg-red-600',
    'bg-red-700',
    'text-blue-600',
    'text-green-600',
    'text-red-600',
    'border-blue-600',
    'border-green-600',
    'border-red-600',
    // Animation classes that might be dynamically added
    'animate-spin',
    'animate-pulse',
    'animate-bounce'
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          ...colors.slate,
          900: '#121a28',
          850: '#1f2937',
        },
        primary: colors.cyan,
        secondary: colors.orange,
        success: colors.green,
        warning: colors.yellow,
        error: colors.red,
        'white-97': 'rgba(255, 255, 255, 0.97)',
        'gray-900-97': 'rgb(17 24 39 / 0.97)',
      },
      fontFamily: {
        sans: ['"Sora"', ...fontFamily.sans],
        serif: ['Georgia', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'large': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in-up': 'slideInUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'marquee': 'marquee 288s linear infinite',
        'marquee-reverse': 'marquee-reverse 288s linear infinite',
        'marquee-mobile': 'marquee 64s linear infinite',
        'marquee-reverse-mobile': 'marquee-reverse 64s linear infinite',
        'infinite-scroll': 'infinite-scroll 120s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        bounceGentle: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-5px)' },
          },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
            '0%': { transform: 'translateX(-50%)' },
            '100%': { transform: 'translateX(0%)' },
        },
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        }
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      perspective: {
        '1000': '1000px',
        '1500': '1500px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
        'visible': 'visible',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    function({ addUtilities }) {
      const newUtilities = {
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.backface-visible': {
          'backface-visibility': 'visible',
        },
      }
      addUtilities(newUtilities)
    }
  ],
} 