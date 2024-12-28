/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1D3D47", // Default primary color for the clinic
        secondary: "#A1CEDC", // Light secondary color
        danger: "#FF6B6B", // Alerts and errors
        success: "#28A745", // Success messages
        neutral: "#F9F9F9", // Background
      },
      fontFamily: {
        sans: ["Poppins-Regular", "sans-serif"],
        bold: ["Poppins-Bold", "sans-serif"],
        heading: ["Nunito-Black", "sans-serif"],
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
    },
  },
  plugins: [],
};
