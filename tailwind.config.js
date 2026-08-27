/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf8f5',
          100: '#f4efe9',
          200: '#e7dccd',
          300: '#d8c7b1',
          500: '#857967',
          600: '#6d5f54',
          700: '#53473d',
          800: '#2c221e',
          900: '#1c1714',
          accent: '#d6785a',
          gold: '#d9b15c',
          blush: '#f5d6c9',
          cream: '#faf8f5'
        }
      },
      boxShadow: {
        soft: '0 12px 30px rgba(44, 34, 30, 0.08)',
        glow: '0 10px 35px rgba(214, 120, 90, 0.22)',
        card: '0 18px 45px rgba(44, 34, 30, 0.08)'
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        'fade-in-up': 'fadeInUp 0.55s ease-out forwards'
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top left, rgba(214,120,90,0.18), transparent 45%), radial-gradient(circle at bottom right, rgba(133,121,103,0.18), transparent 35%)'
      }
    },
  },
  plugins: [],
}