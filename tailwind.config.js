/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  safelist: ["bg-brand-background"],
  content: ["./src/**/*.{html,ts,css}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blueLight: "#d1fae5",
          blueDark: "#047857",
          blueDarker: "#065f46",
          greenAccent: "#10b981",
          greenSuccess: "#059669",
          blackAlpha10: "#064e3b",
          whiteAlpha25: "#bbf7d0",
          whiteAlpha18: "#bbf7d0",
          shadowLight: "#065f46",
          shadowDark: "#065f46",
          primary: "#059669",
          secondary: "#10b981",
          accent: "#34d399",
          gold: "#a7f3d0",
          background: "#f0fdf4",
          surface: "#d1fae5",
          text: "#065f46",
          muted: "#6ee7b7",
          light: "#bbf7d0",
          border: "#6ee7b7",
          success: "#059669",
          warning: "#bef264",
          error: "#dc2626",
          gray50: "#f0fdf4",
          gray100: "#d1fae5",
          gray200: "#bbf7d0",
          gray300: "#6ee7b7",
          gray400: "#34d399",
          gray500: "#10b981",
          gray600: "#059669",
          gray700: "#047857",
          gray800: "#065f46",
          gray900: "#064e3b",
          blue50: "#d1fae5",
          blue100: "#bbf7d0",
          green50: "#f0fdf4",
          green100: "#bbf7d0",
          yellow500: "#bef264",
        },
      },
      fontFamily: {
        sans: ["Nunito", "ui-sans-serif", "system-ui"],
      },
      spacing: {
        // espaciado muy pequeño (por ejemplo, entre icono y texto)
        xs: "0.5rem",

        // espaciado pequeño (elementos agrupados)
        sm: "1rem",

        // espaciado medio (entre elementos dentro de una misma sección)
        md: "2rem",

        // espaciado grande (entre secciones distintas)
        lg: "4rem",

        // espaciado extra grande (bloques destacados o headers)
        xl: "6rem",

        // separación vertical estándar entre secciones
        section: "4rem",
      },
    },
  },
  plugins: [],
};
