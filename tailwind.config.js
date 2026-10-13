/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Colores principales del Brandbook EcoSwipe
        'verde-hoja': '#1E8449',
        'verde-brote': '#5BC27A',
        'verde-bosque': '#12372A',
        'menta': '#DDF3E6',
        'crema': '#FBF7EE',
        'terracota': '#E4793B',
        'gris-calido': '#6B6F6A',

        // NOTA: Los fondos de retazos textiles (algodón, denim, licra, etc.) en PlaceholderImg.jsx
        // se consideran "colores de producto" (excepción semántica a la paleta oficial). No usar para UI.

        // Escalas derivadas: ÚNICAMENTE para estados interactivos (hover, active, focus).
        // No utilizar en pantallas fuera de estas microinteracciones.
        brand: {
          50:  '#DDF3E6', // Menta (base)
          100: '#C5EBD5', // Hover de menta
          200: '#95DAB0',
          300: '#5BC27A', // Verde Brote
          400: '#34A25F',
          500: '#1E8449', // Verde Hoja (Principal)
          600: '#196F3D', // Hover de botón primario
          700: '#12372A', // Verde Bosque (Texto/Fondos oscuros)
          800: '#0E2E23', // Active/hover oscuro
          900: '#0A2018',
        },
        accent: {
          50:  '#FDF3EC', // Fondo suave derivado de Terracota
          100: '#FBE3D3',
          200: '#F6C3A3',
          300: '#F09F70',
          400: '#E77F42',
          500: '#E4793B', // Terracota Oficial
          600: '#C76329', // Hover de acento
        },
        success: '#1E8449',
        error: '#D32F2F', // Exclusivo para validación de errores en formularios
        warning: '#E4793B',
      },
      fontFamily: {
        sans: ['Inter', 'Calibri', 'system-ui', 'sans-serif'],
        title: ['Fredoka', 'Arial Rounded MT Bold', 'sans-serif'],
        fredoka: ['Fredoka', 'Arial Rounded MT Bold', 'sans-serif'],
      },
      fontSize: {
        'titulo': ['28px', { lineHeight: '1.2', fontWeight: '600' }],
        'subtitulo': ['20px', { lineHeight: '1.2', fontWeight: '500' }],
        'cifra': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'cuerpo': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'etiqueta': ['14px', { lineHeight: '1.4', fontWeight: '600' }],
      },
      borderRadius: {
        'tarjeta': '16px',
        'boton': '14px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(18, 55, 42, 0.05)',
        card: '0 2px 8px rgba(18, 55, 42, 0.05)',
        'card-hover': '0 6px 18px rgba(18, 55, 42, 0.09)',
        modal: '0 16px 40px rgba(18, 55, 42, 0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
