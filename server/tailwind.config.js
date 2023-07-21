/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        //choosing the primary color
        primary: "#B73E3E",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }, //so it doesn't clash with other UI libraries
};
