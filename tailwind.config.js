/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'zen-moss': '#3A5A40',    // Verde bosque profundo
        'zen-leaf': '#588157',    // Verde hoja seco
        'zen-wood': '#A3B18A',    // Tono madera clara / Salvia
        'zen-sand': '#DAD7CD',    // Fondo arena suave
        'zen-ink': '#344E41',     // Negro verdoso para textos
        'zen-bone': '#F5F5F0',    // Blanco roto tipo papel japonés
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Tipografía limpia y moderna
      },
    },
  },
  plugins: [],
}