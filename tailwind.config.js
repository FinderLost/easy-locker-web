/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  safelist: ["bg-brand-background"],
  content: ["./src/**/*.{html,ts,css}"],
  theme: {
    extend: {
      colors: {
        // Paleta basada en el logo - Elegante y confiable
        brand: {
          // Colores globales encontrados en el proyecto
          blackAlpha10: "rgba(0, 0, 0, 0.1)",
          whiteAlpha25: "rgba(255, 255, 255, 0.25)",
          whiteAlpha18: "rgba(255, 255, 255, 0.18)",
          blueLight: "#f1f5f9",
          blueDark: "#1e3a8a",
          blueDarker: "#1e40af",
          greenAccent: "#10b981",
          greenSuccess: "#059669",
          shadowLight: "rgba(15, 23, 42, 0.08)",
          shadowDark: "rgba(15, 23, 42, 0.18)",
          // Sombra testimonial clara
          shadowLight: "rgba(15, 23, 42, 0.08)",
          // Sombra testimonial oscura
          shadowDark: "rgba(15, 23, 42, 0.18)",
          // Color primario del logo (gris oscuro elegante)
          primary: "#34373A",

          // Color secundario (gris medio sofisticado)
          secondary: "#5A5D61",

          // Acento verde elegante (confianza y seguridad)
          accent: "#3d8975",

          // Acento dorado sutil (premium y confiable)
          gold: "#C9A961",

          // Fondo claro (elegante y limpio)
          background: "#F8F9FA",

          // Superficie blanca
          surface: "#FFFFFF",

          // Texto principal (color del logo)
          text: "#34373A",

          // Texto secundario
          muted: "#6B7280",

          // Texto claro (para fondos oscuros)
          light: "#E8E8E8",

          // Bordes sutiles
          border: "#E5E7EB",

          // Estados de éxito
          success: "#059669",

          // Estados de advertencia
          warning: "#D97706",

          // Estados de error
          error: "#DC2626",
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
