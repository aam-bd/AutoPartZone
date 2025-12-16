/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#90281F',
      },
      fontFamily: {
        'space': ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}