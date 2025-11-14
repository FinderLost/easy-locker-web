/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  safelist: ["bg-brand-background"],
  content: ["./src/**/*.{html,ts,css}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // Neutros y fondos
          background: "#F8F9FA",
          surface: "#FFFFFF",
          darkBackground: "#111827", // gray900
          darkSurface: "#1f2937", // gray800
          backgroundSoft: "#f9fafb", // gray50
          infoBackground: "#eff6ff", // blue50
          successBackground: "#f0fdf4", // green50

          // Bordes
          border: "#e5e7eb", // gray200
          borderSubtle: "#f3f4f6", // gray100
          borderStrong: "#d1d5db", // gray300
          darkBorder: "#374151", // gray700

          // Texto semántico
          textPrimary: "#34373A",
          textSecondary: "#6B7280",
          textMuted: "#5A5D61",
          iconMuted: "#9ca3af", // gray400

          accent: "#3d8975",
          gold: "#C9A961",

          // Grises (escala técnica, no eliminar aún)
          gray50: "#f9fafb",
          gray100: "#f3f4f6",
          gray200: "#e5e7eb",
          gray300: "#d1d5db",
          gray400: "#9ca3af",
          gray700: "#374151",
          gray800: "#1f2937",
          gray900: "#111827",

          // Azules
          blueDark: "#1e3a8a",
          blueDarker: "#1e40af",
          blue100: "#dbeafe",

          // Verdes
          greenAccent: "#10b981",
          green100: "#dcfce7",
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
