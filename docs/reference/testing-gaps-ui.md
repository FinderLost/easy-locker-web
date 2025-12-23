---
title: Pendientes de pruebas UI/E2E
description: Backlog de casos de prueba UI/E2E aún no cubiertos en Playwright/Karma.
tags: [reference, testing, e2e, ui]
owner: web-team
last_updated: 2025-12-21
status: approved
llm_summary: Lista priorizada de huecos de pruebas UI/E2E: pricing cards y enlaces, testimonios (estados y carrusel), cookies y persistencia, CTAs hero, routing secundario, servicios de idioma/tema/consent.
---

# Pendientes de pruebas UI/E2E

Casos que aún no están cubiertos; prioriza los bloques superiores antes de añadir más alcance.

## Alta prioridad (experiencia crítica)
- Pricing: render de 3 planes, enlaces `hero.links.reserve` en cada card, tracking `plan_card_click` no rompe, imágenes visibles.
- Hero CTAs: comprobar `reserve`/`directions` apuntan a URLs traducidas y abren en nueva pestaña.
- Testimonios (estado con datos cache): carrusel visible, navegación prev/next, CTA "Dejar reseña" y "Ver perfil" apuntan a URLs externas, etiqueta "Última actualización" se muestra cuando hay datos.
- Banner de cookies: aparece sin consentimiento, botones "Aceptar solo esenciales"/"Aceptar todas" cierran banner, persiste en recarga (`localStorage`), enlace a `/politica-cookies` funciona.
- Persistencia de idioma/tema: cambiar idioma y tema, recargar y verificar `localStorage`, `document.documentElement.lang` y clase `dark`.

## Media prioridad (navegación y fallback)
- Ruta `/politica-cookies`: carga contenido y no muestra home; `**` redirige a `/`.
- Testimonios (sin config Google Reviews): muestra fallback empty/loading sin romper; `reviews_view` solo cuando sección visible.
- FAQ: probar más de un ítem (abrir/cerrar varios) y que `faq_view` se dispare al entrar en viewport.

## Baja prioridad (servicios y métricas)
- `LanguageService`: normaliza locales (`es-ES` -> `es`), usa idioma por defecto si no soportado, `document.documentElement.lang` actualizado.
- `ThemeService`: ciclo de preferencias (light/dark/system), persistencia en `localStorage`, aplica clase `dark`, migración de clave `theme` legacy.
- `CookieConsentService`: versión de consentimiento, lectura/escritura segura sin `localStorage`, getters (`hasAnswered`, `analyticsEnabled`).
- Analytics: stubs/mocks para `AnalyticsService` asegurando que llamadas no rompen en SSR/local.

## Notas para implementarlos
- Usa `data-testid` existentes; si faltan, añadirlos en plantillas antes de testear.
- Forzar estados de testimonios: mock de `window.EASY_LOCKER_GOOGLE_API_KEY`/`PLACE_ID` vacío para fallback; usar fixture `assets/data/google-reviews.json` para estado con datos.
- Para persistencia, limpiar `localStorage` en `beforeEach` y validar tras recarga (`page.reload()`).
- Mantener `workers=1` si el test arranca auto-slide o timers para reducir flakiness.
