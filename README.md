# EasyLockerAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.16.

## ⚠️ CRITICAL: SEO Protection

**Before modifying ANY SEO element (URLs, titles, H1, canonical, hreflang, robots.txt):**

1. **Read:** [docs/reference/normas-criticas-seo.md](docs/reference/normas-criticas-seo.md)
2. **Register changes:** [docs/reference/seo-changelog.md](docs/reference/seo-changelog.md)
3. **Follow process:** [docs/how-to/cambios-seo-seguros.md](docs/how-to/cambios-seo-seguros.md)

**Why?** Uncontrolled changes can cause traffic drops, ranking losses, or de-indexing.

---

## ⚠️ Known Security Vulnerabilities

**Status:** 34 vulnerabilities detected (2 critical, 24 high, 5 moderate, 3 low)  
**Affected:** Angular 16.2 and development dependencies  
**Resolution:** Requires upgrade to Angular 18+ LTS

**Impact:** Mostly development dependencies. Production impact is low (XSS in Angular if processing untrusted SVG/MathML).

**See:** [docs/reference/security-vulnerabilities-2026-01.md](docs/reference/security-vulnerabilities-2026-01.md) for full analysis and upgrade plan.

**Mitigation:**
- Use `npm start` only on trusted local network
- Do not process untrusted SVG/MathML user inputs
- Upgrade to Angular 18 planned for next sprint

---

## Documentation

- Main hub: [docs/README.md](docs/README.md)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Theme and language preferences

### Theme (light / dark)

- The app auto-detects the OS theme via `prefers-color-scheme` and applies it on first paint (see the inline script in `src/index.html`).
- Users can pick **Claro**, **Oscuro** or **Sistema** from the header toggle. Their choice is saved under the `theme-preference` key in `localStorage`.
- The `ThemeService` (`src/app/services/theme.service.ts`) exposes `setPreference()` and observables for both the preference and the resolved dark-mode flag. Components that need to react to theme changes should subscribe there instead of re-implementing detection.
- To tweak colors, edit the CSS variables declared in `src/styles.css`—no extra logic is required.

### Languages

- Supported locales live in `src/app/services/language.service.ts` (default is English). Each locale must also have its JSON file inside `src/assets/i18n/`.
- On startup the `LanguageService` resolves the language in this order: stored override → browser preference (by normalizing `navigator.languages`/`navigator.language`) → English fallback.
- Manual changes through the language switcher persist in `localStorage` (`language` key) and immediately call `translate.use(...)` from `ngx-translate`.
- To add a new language: add the JSON file, register its code and label in the `supportedLanguages` array, and (optionally) expose it in the language switcher UI.

## Google Reviews configuration

The testimonials section pulls real data from Google Business Profile. Before deploying, set your credentials in `src/assets/config/reviews-config.js`:

```js
(function () {
  window.EASY_LOCKER_GOOGLE_PLACE_ID = "YOUR_PLACE_ID";
  window.EASY_LOCKER_GOOGLE_API_KEY = "YOUR_PUBLIC_BROWSER_KEY";
})();
```

Both values are required; if either is missing the section will keep showing the empty state. For production you can generate this file dynamically at deploy time so your keys are not stored in version control.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
