---
title: Estado actual del i18n y rutas multi-idioma
owner: web-team
description: Resumen de la implementación actual de internacionalización, rutas y librerías usadas para SEO multi-idioma en Easy Locker Web.
tags: [reference, i18n, seo, rutas]
last_updated: 2025-12-23
status: approved
---

# Estado actual del i18n y rutas multi-idioma

## 1. Reflejo del idioma en la URL
- El idioma se refleja con prefijo: rutas `/es`, `/en`, `/fr`, `/de`, `/it` renderizan Home (SPA) pero se marcan como `noindex` para SEO.
- `/` actúa como x-default y redirige al idioma detectado o a `en` (UX), pero la canónica siempre es `https://easy-locker.com/`.
- El idioma se sincroniza en URL + localStorage (`language`) + `document.documentElement.lang`.
- Excepción: la política de cookies sigue usando los slugs existentes sin prefijo (ver `COOKIE_POLICY_SLUGS`).

## 2. Librerías de internacionalización
- Se utiliza **@ngx-translate/core** y **@ngx-translate/http-loader** para traducción dinámica.
- También está presente `@angular/localize`, pero la gestión principal es con ngx-translate.

## 3. Rutas reales y SEO efectivo
- Canónica única para todas las páginas: `https://easy-locker.com/`.
- Prefijos de idioma (`/es`, `/en`, `/fr`, `/de`, `/it`) sirven UX pero se marcan `noindex`; no se generan etiquetas `hreflang`.
- Política de cookies (sin prefijo): `https://easy-locker.com/<slug>` con los slugs de `COOKIE_POLICY_SLUGS`; hereda la canónica raíz.
- Sitemap solo incluye URLs indexables reales (home y cookies). SPA en GitHub Pages con `404.html` para refrescos en `/lang`.

---

> Última revisión: 2025-12-23
