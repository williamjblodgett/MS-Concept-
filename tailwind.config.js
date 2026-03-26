/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'ms-red': '#C41230',
        'ms-red-dark': '#A00E28',
        'ms-navy': '#1B2A4A',
        'ms-navy-light': '#2A3F6A',
        'ms-gray': '#F5F5F5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
