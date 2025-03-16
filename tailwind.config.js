/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Include all .html and .ts files under src
    "!./src/app/theme/**/*.{html,ts}", // Exclude all .html and .ts files under src/app/theme
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
};