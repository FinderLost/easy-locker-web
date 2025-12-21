---
title: Dar de alta un nuevo idioma (i18n + reviews)
description: Pasos para añadir un idioma al sitio, traducir contenidos, habilitar el selector y actualizar la caché de reseñas de Google.
tags: [how-to, i18n, language, reviews]
owner: web-team
last_updated: 2025-12-21
status: approved
llm_summary: Checklist y pasos para añadir un idioma: crear el JSON de i18n, habilitarlo en el selector, etiquetar en las demás lenguas, ajustar CTAs con locale, incluir el código en el workflow de reseñas y lanzar la actualización.
---

# Dar de alta un nuevo idioma

Guía rápida para añadir un idioma (UI + reseñas) sin olvidar la caché de Google Reviews.

## Checklist rápido
- [ ] Archivo `src/assets/i18n/<lang>.json` creado y traducido (incluye SEO, hero, FAQs, footer y cookies).
- [ ] `language.service.ts` actualizado con el nuevo código en `supportedLanguages`.
- [ ] Etiqueta del idioma añadida en `header.language.options` de **todas** las lenguas existentes.
- [ ] Enlaces con `locale` (ej. `hero.links.reserve`) apuntan al nuevo código.
- [ ] Workflow `.github/workflows/update-reviews.yml` incluye el código en `LANGS=(...)` y se ha lanzado para rellenar `src/assets/data/google-reviews.json`.
- [ ] UI verificada en `npm start` con el selector de idiomas.

## Pasos detallados

1) **Crear y traducir el JSON**
- Duplica un idioma base (p. ej. `en.json`) a `src/assets/i18n/<lang>.json`.
- Traduce todo el contenido: SEO, hero, pricing, FAQs, footer, cookies/política y textos aria.
- Ajusta `hero.links.reserve` para usar `locale=<lang>` si aplica.

2) **Habilitar en el selector**
- En `src/app/services/language.service.ts`, añade `{ code: '<lang>', labelKey: 'header.language.options.<lang>' }` en `supportedLanguages`.
- Añade la etiqueta traducida en `header.language.options.<lang>` dentro de **cada** archivo `src/assets/i18n/*.json` existente.

3) **Reviews de Google en el nuevo idioma**
- Edita `.github/workflows/update-reviews.yml` y suma el código en `LANGS=(en es fr de it pt ...)`.
- Lanza el workflow "Update Google Reviews Cache" (Actions → Run workflow) para regenerar `src/assets/data/google-reviews.json` con la nueva traducción.
- En local, si necesitas probar el fallback en vivo, coloca `window.EASY_LOCKER_GOOGLE_API_KEY` y `window.EASY_LOCKER_GOOGLE_PLACE_ID` en `src/assets/config/reviews-config.js` (este archivo está gitignored) y ejecuta `npm start`.

4) **Verificar**
- `npm start` y cambia al nuevo idioma: revisa hero, planes, FAQs, footer y secciones dinámicas (testimonios muestran traducción o fallback en su idioma original).
- Opcional: `npm test` o los e2e relevantes si cambiaste textos clave.

## Referencias
- [Actualizar reseñas de Google (cache semanal)](actualizar-reviews.md)
- [Editar contenido](editar-contenido.md)
