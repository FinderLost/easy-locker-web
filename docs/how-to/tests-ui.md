---
title: Ejecutar y mantener tests UI (Playwright)
description: Configuración, ejecución y buenas prácticas para las pruebas E2E/UI con Playwright en Easy Locker Web.
tags: [how-to, testing, e2e, ui]
owner: web-team
last_updated: 2025-12-21
status: approved
llm_summary: Guía para correr y mantener las pruebas E2E/UI con Playwright: instalación, scripts npm, reutilizar servidor, selectores y consejos anti-flakiness.
---

# Ejecutar y mantener tests UI (Playwright)

Esta guía explica cómo correr los smoke tests de interfaz con Playwright y cómo mantenerlos estables.

## Preparación
- Instala dependencias: `npm install`
- Instala Playwright (solo la primera vez): `npx playwright install chromium`
- Asegúrate de tener el placeholder de Firebase en `src/environments/firebase.config.ts` (ya existe con llaves dummy).

## Scripts rápidos
- `npm run test:e2e`: ejecuta los tests E2E en modo headless (Chromium) y arranca el dev server en `http://localhost:4200` automáticamente.
- `npm run test:e2e -- --workers=1`: mismo comando, forzando un solo worker (útil en local si usas pocos recursos).
- `npm run test:e2e:headed`: abre el navegador visible.
- `npm run test:e2e:ui`: abre el Test Runner UI de Playwright.

## Reutilizar un servidor ya levantado
Si ya tienes `npm start` corriendo, puedes reutilizarlo:
1) Exporta la URL: `export BASE_URL=http://localhost:4200`
2) Lanza los tests sin arrancar otro server: `npx playwright test --workers=1`

## Dónde viven los tests
- Código: `e2e/` (ej. `e2e/home.spec.ts`).
- Config: `playwright.config.ts` (puertos, baseURL, trazas, video on failure).

## Selectores y estabilidad
- Usa `data-testid` existentes (`hero-cta-reserve`, `language-switcher-toggle`, `theme-option-dark`, `faq-toggle-0`, etc.).
- Si necesitas nuevos, añade atributos `data-testid` en la plantilla; no inventes claves de i18n.
- Evita asserts frágiles con textos traducidos; prioriza roles (`getByRole`) o test ids.
- Para la cookie banner, cierra con el botón "Aceptar solo esenciales" (`acceptCookies()` en los tests de ejemplo).

## Extender la cobertura
- Añade flujos críticos: navegación a reservas, enlaces a Google Maps, apertura de testimonios.
- Considera checks rápidos de accesibilidad con `@axe-core/playwright` (añádelo como devDependency si lo necesitas).
- Para regresión visual ligera, habilita `screenshot: 'only-on-failure'` en `use` o añade `expect(page).toHaveScreenshot()` en escenarios clave.

## CI
- Reutiliza `npm run test:e2e` en GitHub Actions antes del build. El config arranca el server y reutiliza uno existente fuera de CI.
- En PR se ejecuta `ci-tests.yml` con `npm test -- --watch=false --browsers=ChromeHeadless` y `npm run test:e2e -- --workers=1` usando un `firebase.config.ts` placeholder.
