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
          darkSurface: "var(--brand-dark-surface)",
          darkSurfaceHover: "var(--brand-dark-surface-hover)",
          darkText: "var(--brand-dark-text)",
          darkTextStrong: "var(--brand-dark-text-strong)",

          accentPrimary: "var(--brand-accent-primary)",
          accentSecondary: "var(--brand-accent-secondary)",
        },
        easy: {
          surfaceElevatedLight: "var(--easy-surface-elevated-light)",
          surfaceElevatedHoverLight: "var(--easy-surface-elevated-hover-light)",
          surfaceSelectedLight: "var(--easy-surface-selected-light)",
          dropdownHoverLight: "var(--easy-dropdown-hover-light)",
          borderSubtleLight: "var(--easy-border-subtle-light)",
          textSecondaryLight: "var(--easy-text-secondary-light)",

          surfaceElevated: "var(--easy-surface-elevated)",
          surfaceElevatedHover: "var(--easy-surface-elevated-hover)",
          surfaceSelectedDark: "var(--easy-surface-selected-dark)",
          dropdownHoverDark: "var(--easy-dropdown-hover-dark)",
          borderSubtleDark: "var(--easy-border-subtle-dark)",
          textSecondaryDark: "var(--easy-text-secondary-dark)",
          headerPillBg: "var(--easy-header-pill-bg)",
          headerPillBgHover: "var(--easy-header-pill-bg-hover)",
          headerPillFg: "var(--easy-header-pill-fg)",
          paletteActionStrong: "var(--easy-palette-action-strong)",
          paletteDepthMid: "var(--easy-palette-depth-mid)",

          indicator: "var(--easy-indicator-color)",
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
      boxShadow: {
        easyElevated: "var(--easy-shadow-elevated)",
        "brand-soft": "var(--brand-shadow-soft)",
        "brand-strong": "var(--brand-shadow-strong)",
      },
    },
  },
  plugins: [],
};
