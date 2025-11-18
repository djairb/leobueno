/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Adicione aqui:
      colors: {
        logoenf: {
          DEFAULT: '#209E9E', // A cor original (chamada com bg-logoenf)
          light: '#4DB5B5',
          dark: '#197E7E'   // A versão mais clara (chamada com bg-logoenf-light)
        }
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}