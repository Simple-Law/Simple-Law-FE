/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "Btn-Text-Disabled": "#94A3B8",
        "Color-gray-900": "#272C3B",
      },
      backgroundColor: theme => ({
        ...theme("colors"),
        primary: "#F9F9F9",
        secondary: "#ffed4a",
        danger: "#e3342f",
        kakaoYellow: "#FEE502",
      }),
    },
  },
  plugins: [],
};
