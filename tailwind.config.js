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
          darkBackground: "#111827",
          darkSurface: "#1f2937",
          backgroundSoft: "#f9fafb",
          infoBackground: "#eff6ff",
          successBackground: "#f0fdf4",

          // Bordes
          border: "#e5e7eb",
          borderSubtle: "#f3f4f6",
          borderStrong: "#d1d5db",
          darkBorder: "#374151",

          // Texto semántico
          textPrimary: "#34373A",
          textSecondary: "#6B7280",
          textMuted: "#5A5D61",
          iconMuted: "#9ca3af",

          accent: "#3d8975",
          gold: "#C9A961",
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
