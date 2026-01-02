/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Slate & Carbon palette
        brand: '#be123c', // Deep Crimson for accents
        'slate-50': '#f8fafc',
        'slate-100': '#f1f5f9',
        'slate-200': '#e2e8f0',
        'slate-300': '#cbd5e1',
        'slate-400': '#94a3b8',
        'slate-500': '#64748b',
        'slate-600': '#475569', // Main text color
        'slate-700': '#334155',
        'slate-800': '#1e293b',
        'slate-900': '#0f172a', // Header text color
        'rose-50': '#fff1f2',
        'rose-600': '#e11d48',
      },
      fontFamily: {
        'sans': ['Inter', 'Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'space': ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgb(0,0,0,0.04)',
        'soft-lg': '0 12px 40px rgb(0,0,0,0.06)',
        'soft-xl': '0 20px 60px rgb(0,0,0,0.08)',
        'inner-soft': 'inset 0 2px 10px rgb(0,0,0,0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}