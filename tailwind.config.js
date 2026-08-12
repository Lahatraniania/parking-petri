/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'parking-green': '#22c55e',
        'parking-red': '#ef4444',
        'parking-orange': '#f97316',
      }
    },
  },
  plugins: [],
}