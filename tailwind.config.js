/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sc-orange': '#ff5500',
        'sc-dark': '#121212',
        'sc-gray': '#333',
        'soundcloud-orange': '#ff5500',
        'soundcloud-dark': '#121212',
        'soundcloud-gray': '#333333',
      },
    },
  },
  plugins: [],
}; 