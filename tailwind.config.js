/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  content: [],
  theme: {
    screen: {
      xs: '500px',
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
    },
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      boxShadow: {
        'custom': '0px 8px 0px 2px rgba(0, 0, 0, 0.12), 5px 0px 4px 0px rgba(0, 0, 0, 0.06)',
        'custom-2': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        primary: "#1e6cbe",
        darkGray: "#9D9D9D",
        gray: "#CDD0CB",
        lightGray: "#E8EAE6",
        textPrimary: "#043464",




        lightorange: "#F2BB7B",
        secondary: "#1E1F20",
        colorRed: "#ed4337",
        primaryBackground: "#EFECF7",
        colorBrown: "#593D3D",
        colorGreen: "#3db39e"
      },
    },
  },
  plugins: [],
}

