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
- El idioma ahora se refleja con prefijo: rutas `/es`, `/en`, `/fr`, `/de`, `/it` renderizan Home (SPA).
- `/` actúa como x-default y redirige al idioma detectado o a `en`.
- El idioma se sincroniza en URL + localStorage (`language`) + `document.documentElement.lang`.
- Excepción: la política de cookies sigue usando los slugs existentes sin prefijo (ver `COOKIE_POLICY_SLUGS`).

## 2. Librerías de internacionalización
- Se utiliza **@ngx-translate/core** y **@ngx-translate/http-loader** para traducción dinámica.
- También está presente `@angular/localize`, pero la gestión principal es con ngx-translate.

## 3. Rutas reales en producción para ES/EN/FR/DE/IT
- Home: `https://easy-locker.com/es/`, `/en/`, `/fr/`, `/de/`, `/it/` (canonical + hreflang generados en runtime).
- X-default: `https://easy-locker.com/` (redirige a idioma detectado o `en`).
- Política de cookies (excepción sin prefijo): `https://easy-locker.com/<slug>` donde `<slug>` es `COOKIE_POLICY_SLUGS[lang]` (p. ej. `politica-cookies`, `cookie-policy`, etc.).
- El despliegue sigue siendo SPA en GitHub Pages; el `404.html` mantiene el redirect para refrescos en `/lang`.

---

> Última revisión: 2025-12-23
