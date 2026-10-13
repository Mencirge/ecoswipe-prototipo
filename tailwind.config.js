/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#E8F5E9', 100: '#C8E6C9', 200: '#A5D6A7', 300: '#81C784',
          400: '#52B788', 500: '#2D6A4F', 600: '#245A42', 700: '#1B4332',
          800: '#143326', 900: '#0D2419',
        },
        accent: {
          50: '#FFF3E0', 100: '#FFE0B2', 200: '#FFCC80',
          300: '#F4A261', 400: '#E76F51', 500: '#D45D3A',
        },
        success: '#40916C', error: '#E63946', warning: '#F4A261', info: '#457B9D',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
        modal: '0 16px 48px rgba(0,0,0,0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(24px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}

