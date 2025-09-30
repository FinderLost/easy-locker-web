/** @type {import('tailwindcss').Config} */
module.exports = {
  safelist: ["bg-brand-background"],
  content: ["./src/**/*.{html,ts,css}"],
  theme: {
    extend: {
      colors: {
        // Ajuste temporal: usar superficie blanca como fondo por defecto para evitar UI en negro
        "brand-background": "#F4F5F7",
        // superficie blanca
        "brand-surface": "#FFFFFF",
        // texto principal
        "brand-text": "#1F2328",
        // texto secundario
        "brand-muted": "#6C7278",
        brand: {
          // gris profundo proveniente del logo
          primary: "#34373A",

          // coral cálido como acento complementario
          secondary: "#CBC8C5",

          // fondo claro neutro
          background: "#F4F5F7",

          // superficie blanca
          surface: "#FFFFFF",

          // texto principal de alto contraste
          text: "#1F2328",

          // texto secundario suavizado
          muted: "#6C7278",
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
