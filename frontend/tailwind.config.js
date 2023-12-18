/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#45B4D0',
        secondary: '#66FFDO',
        blue: '#151865',
        lightRed: '#ef4444',
      },
    },
  },
  plugins: [],
}

