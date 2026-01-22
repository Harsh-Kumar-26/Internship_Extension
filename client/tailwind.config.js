/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // <--- ADD THIS LINE EXACTLY HERE
  theme: {
    extend: {},
  },
  plugins: [],
}