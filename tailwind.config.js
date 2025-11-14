/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  safelist: ["bg-brand-background"],
  content: ["./src/**/*.{html,ts,css}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blueLight: "#f1f5f9",
          blueDark: "#1e3a8a",
          blueDarker: "#1e40af",
          greenAccent: "#10b981",
          greenSuccess: "#059669",
          blackAlpha10: "#000000",
          whiteAlpha25: "#FFFFFF",
          whiteAlpha18: "#FFFFFF",
          shadowLight: "#0F172A",
          shadowDark: "#0F172A",
          primary: "#34373A",
          secondary: "#5A5D61",
          accent: "#3d8975",
          gold: "#C9A961",
          background: "#F8F9FA",
          surface: "#FFFFFF",
          text: "#34373A",
          muted: "#6B7280",
          light: "#E8E8E8",
          border: "#E5E7EB",
          success: "#059669",
          warning: "#D97706",
          error: "#DC2626",
          gray50: "#f9fafb",
          gray100: "#f3f4f6",
          gray200: "#e5e7eb",
          gray300: "#d1d5db",
          gray400: "#9ca3af",
          gray500: "#6b7280",
          gray600: "#4b5563",
          gray700: "#374151",
          gray800: "#1f2937",
          gray900: "#111827",
          blue50: "#eff6ff",
          blue100: "#dbeafe",
          green50: "#f0fdf4",
          green100: "#dcfce7",
          yellow500: "#eab308",
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
