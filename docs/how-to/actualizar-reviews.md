---
title: Actualizar reseñas de Google (cache semanal y multilenguaje)
description: Cómo refrescar las reseñas de Google, con textos en varios idiomas, y servirlas desde assets usando el workflow programado.
tags: [how-to, reviews, google, cache, i18n]
owner: web-team
last_updated: 2025-12-16
status: approved
llm_summary: Explica el workflow programado que trae reviews de Google Places v1 cada semana, genera traducciones para en/es/fr/de/it y las guarda en assets/data/google-reviews.json; incluye cómo lanzarlo manualmente y probar en local.
---

# Actualizar reseñas de Google (cache semanal)

Este sitio sirve las reseñas desde un JSON estático que se refresca con un workflow semanal. Así evitamos llamadas en runtime y costes altos de Places API.

## Prerrequisitos
- Secrets configurados en GitHub repo: `GOOGLE_API_KEY` y `GOOGLE_PLACE_ID`.
- En Google Cloud, la API habilitada: **Places API (New)**. La key debe permitir el endpoint `places.googleapis.com/v1/places`.
	- La key puede tener restricciones HTTP/Referer; el workflow la usa desde GitHub Actions (servidor), así que añade también `actions.githubusercontent.com` si restringes por IP/origen.

## Cómo funciona el workflow
Archivo: `.github/workflows/update-reviews.yml`.
- Programación: lunes 03:00 UTC (`cron: 0 3 * * 1`).
- También se puede lanzar manualmente desde GitHub Actions (`workflow_dispatch`).
- Pasos: descarga reviews desde Places v1 en varios idiomas (`en es fr de it`) usando `languageCode`, combina por índice, normaliza campos (autor, rating, fecha, idioma original) y genera un JSON con traducciones por idioma en `src/assets/data/google-reviews.json` (máx. 6 reviews). Si hay cambios, hace commit/push.
- Permisos: usa `contents: write` con `GITHUB_TOKEN`.

## Lanzar manualmente
1. Ve a GitHub → Actions → "Update Google Reviews Cache" → Run workflow.
2. Espera a que termine; si hay cambios, verás un commit `chore: refresh google reviews cache` en `main`.

## Probar en local
1. Tras el commit, `git pull` en tu máquina.
2. Ejecuta `npm start` y abre `http://localhost:4200`.
3. La sección de testimonios lee primero `assets/data/google-reviews.json` y elige el texto traducido según el idioma activo (en/es/fr/de/it). Si el JSON está vacío, cae al fetch directo de Places (requiere `reviews-config.js` con claves locales y usará `languageCode` del idioma actual).

## Notas y límites
- Si el JSON queda vacío, revisa en el log del workflow si la respuesta trae `reviews` o si hay error de clave/cupos.
- El componente sigue teniendo fallback al endpoint en vivo; en producción evitamos llamadas si el JSON contiene datos.
- No subas claves al repo: `src/assets/config/reviews-config.js` está en `.gitignore` para usos locales.
- Las traducciones se basan en el endpoint de Google; si alguna lengua viene vacía, el frontend mostrará el texto original como fallback.
- Cumplimiento TOS: el cache es semanal y solo para uso interno de la web (no se redistribuye). Google permite cache corto para mejorar UX/coste; no lo guardes meses ni expongas el JSON como servicio.
- Transparencia al usuario: la sección muestra "Última actualización" tomando el encabezado `Last-Modified` del JSON cacheado (o la fecha de la última descarga en vivo). Si ves `N/A`, revisa que el servidor sirva ese encabezado o que el workflow haya corrido.

**See also:** [Desplegar a producción](desplegar.md) | [Config Google Reviews](../reference/cambios-realizados.md)
