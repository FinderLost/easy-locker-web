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
          light: "#E8E8E8",
          border: "#E5E7EB",
          shadow: "#0F172A",
          blackAlpha: "rgba(0,0,0,0.10)",
          whiteAlpha: "rgba(255,255,255,0.25)",

          // Texto semántico normalizado
          textPrimary: "#34373A", // antes text y primary
          textSecondary: "#6B7280", // antes muted y gray500
          textMuted: "#5A5D61", // antes secondary y gray600

          accent: "#3d8975",
          gold: "#C9A961",

          // Grises (escala técnica, no eliminar aún)
          gray50: "#f9fafb",
          gray100: "#f3f4f6",
          gray200: "#e5e7eb", // alias de border, pendiente de eliminación
          gray300: "#d1d5db",
          gray400: "#9ca3af",
          gray500: "#6b7280", // alias de textSecondary, pendiente de eliminación
          gray600: "#4b5563", // alias de textMuted, pendiente de eliminación
          gray700: "#374151",
          gray800: "#1f2937",
          gray900: "#111827",

          // Azules
          blueLight: "#f1f5f9",
          blueDark: "#1e3a8a",
          blueDarker: "#1e40af",
          blue50: "#eff6ff",
          blue100: "#dbeafe",

          // Verdes
          greenAccent: "#10b981",
          green50: "#f0fdf4",
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
