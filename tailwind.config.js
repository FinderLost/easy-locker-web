/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  safelist: ["bg-brand-background"],
  content: ["./src/**/*.{html,ts,css}"],
  theme: {
    extend: {
      colors: {
        brand: {
          background: "var(--brand-background)",
          surface: "var(--brand-surface)",
          surfaceStrong: "var(--brand-surface-strong)",
          surfaceSubtle: "var(--brand-surface-subtle)",
          backgroundSoft: "var(--brand-background-soft)",
          infoBackground: "var(--brand-info-background)",
          successBackground: "var(--brand-success-background)",

          border: "var(--brand-border)",
          borderSubtle: "var(--brand-border-subtle)",
          borderStrong: "var(--brand-border-strong)",

          textPrimary: "var(--brand-text-primary)",
          textSecondary: "var(--brand-text-secondary)",
          textMuted: "var(--brand-text-muted)",
          iconMuted: "var(--brand-icon-muted)",

          accentPrimary: "var(--brand-accent-primary)",
          accentSecondary: "var(--brand-accent-secondary)",
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
