/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#f48721",
          ink: "#222831",
          paper: "#fbfaf7",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "Arial", "sans-serif"],
        openSans: ["var(--font-open-sans)", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 28px rgba(19, 31, 42, 0.04)",
        float: "0 8px 28px rgba(0, 0, 0, 0.14)",
      },
    },
  },
  plugins: [],
};
