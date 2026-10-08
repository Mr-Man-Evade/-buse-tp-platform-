/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'buse-blue': '#003399',
        'buse-sky': '#87CEEB',
        'buse-navy': '#001F3F',
        'buse-gold': '#FFD700',
      }
    },
  },
  plugins: [],
}
