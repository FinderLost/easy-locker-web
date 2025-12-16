---
title: Desplegar a producción (GitHub Pages)
description: Cómo construir y publicar el sitio usando la GitHub Action existente o de forma manual.
tags: [how-to, deploy, github-pages, firebase]
owner: web-team
last_updated: 2025-12-15
status: approved
llm_summary: Pasos para desplegar en GitHub Pages; requiere secretos de Firebase para generar firebase.config.ts y usa la acción deploy.yml.
---

# Desplegar a producción (GitHub Pages)

Esta guía cubre el flujo soportado por el repo para publicar en GitHub Pages.

## Flujo automático (recomendado)

1. Asegura que la rama `main` tenga los cambios listos.
2. Configura en el repositorio los secretos usados por `.github/workflows/deploy.yml`:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_MEASUREMENT_ID`
   - `GOOGLE_API_KEY`
   - `GOOGLE_PLACE_ID`
3. Haz push a `main`. La acción:
   - Genera `src/environments/firebase.config.ts` con esos secretos.
   - Ejecuta `npm ci` y `npm run build:prod`.
   - Publica `dist/easy-locker-angular` en GitHub Pages.
4. El enlace de Pages se expone como output `page_url` del job `deploy`.

## Flujo manual (fallback)

1. Crea localmente `src/environments/firebase.config.ts` (usa `src/environments/firebase.config.example.ts` como plantilla y NO lo subas al repo).
2. Instala dependencias: `npm install`.
3. Construye: `npm run build:prod`.
4. Publica a GitHub Pages con la CLI incluida: `npm run deploy` (usa `angular-cli-ghpages` y la carpeta `dist/easy-locker-angular`).

## Notas importantes

- `build:prod` usa `--base-href /`; si se despliega bajo un subpath distinto, ajusta el flag.
- Las credenciales de Google Reviews se inyectan en `src/assets/config/reviews-config.js` desde los secrets `GOOGLE_API_KEY` y `GOOGLE_PLACE_ID` en el pipeline. Para desarrollo local, edita ese archivo con tus valores (no lo subas al repositorio).
- El archivo `src/environments/firebase.config.ts` está en `.gitignore`; debe generarse en cada entorno.

**See also:** [Patrón de documentación](../meta/doc-pattern.md) | [Cambios realizados](../reference/cambios-realizados.md)
