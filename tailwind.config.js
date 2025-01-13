/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "Btn-Text-Disabled": "#94A3B8",
        "Color-gray-900": "#272C3B",
        "Base-Blue": "#287FFF",
      },
      backgroundColor: (theme) => ({
        ...theme("colors"),
        primary: "#F9F9F9",
        secondary: "#ffed4a",
        danger: "#e3342f",
        kakaoYellow: "#FEE502",
        naverGreen: "#03C75A;",
      }),
      boxShadow: {
        custom: "0px 0px 15px 0px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
