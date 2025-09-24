/** @type {import('tailwindcss').Config} */
module.exports = {
  safelist: ["bg-brand-background"],
  content: ["./src/**/*.{html,ts,css}"],
  theme: {
    extend: {
      colors: {
        // Ajuste temporal: usar superficie blanca como fondo por defecto para evitar UI en negro
        "brand-background": "#F9FAFB",
        // superficie blanca
        "brand-surface": "#FFFFFF",
        // texto principal
        "brand-text": "#111827",
        // texto secundario
        "brand-muted": "#6B7280",
        brand: {
          // azul oscuro – transmite seguridad
          primary: "#1E3A8A",

          // verde suave – transmite facilidad
          secondary: "#10B981",

          // fondo claro F9FAFB
          background: "#F9FAFB",

          // superficie blanca
          surface: "#FFFFFF",

          // texto principal
          text: "#111827",

          // texto secundario
          muted: "#6B7280",
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
}

