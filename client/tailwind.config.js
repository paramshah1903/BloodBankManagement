/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#B73E3E",
        secondary: "#3F497F",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }, //so it doesn't clash with other UI libraries
};
