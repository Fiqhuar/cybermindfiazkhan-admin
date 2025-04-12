/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"], // Adjust if your files are elsewhere
    theme: {
      extend: {},
    },
    plugins: [require('@tailwindcss/line-clamp')],
  };
  