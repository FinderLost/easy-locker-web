---
title: Normas críticas de SEO
description: Elementos SEO que NO se pueden cambiar sin control, justificación y registro.
tags: [reference, seo, normas, critical, changelog]
owner: web-team
last_updated: 2026-01-25
status: approved
llm_summary: Inventario de elementos SEO críticos que requieren justificación, registro y revisión antes de cualquier cambio (URLs, canonical, hreflang, titles, H1, robots.txt).
---

# Normas Críticas de SEO

## ⚠️ Principio general

**El SEO NO se puede cambiar a la ligera.**

Los cambios mal controlados no reinician Google, pero pueden provocar:
- Caídas temporales en rankings
- Pérdida de señales acumuladas
- Confusión en el rastreo
- Desindexación parcial o total

### Regla de oro

> **Nada crítico de SEO se cambia sin registro.**  
> **Nada se cambia "por probar".**  
> **Todo se mide antes y después.**

---

## 🔴 ELEMENTOS CRÍTICOS — NO CAMBIAR SIN CONTROL

Estos elementos requieren **justificación**, **registro** y **revisión** antes de cualquier cambio:

### 1. URLs
- **Rutas** (`/es/home`, `/en/pricing`)
- **Slugs** (identificadores en la URL)
- **Idiomas en URL** (prefijos de idioma)
- **Redirects** (301, 302)

#### ⚠️ Impacto
- Cambio de URL sin 301 = pérdida de autoridad
- Cambio de estructura = confusión en indexación

#### ✅ Procedimiento obligatorio
1. Documentar en `docs/reference/seo-changelog.md`
2. Implementar redirect 301 desde URL antigua
3. Actualizar sitemap.xml
4. Validar con Screaming Frog antes de producción

**Archivos afectados:**
- `src/app/app-routing.module.ts`
- `src/sitemap.xml`

---

### 2. robots.txt
- Directivas `Disallow`
- Meta tags `noindex`, `nofollow`

#### ⚠️ Impacto
- Error aquí = **desindexación total o parcial**
- `Disallow: /` bloquea todo el sitio

#### ✅ Procedimiento obligatorio
1. **NUNCA** cambiar sin revisión en doble check
2. Validar en local antes de merge
3. Verificar en staging con Screaming Frog
4. Documentar cambio y motivo

**Archivos afectados:**
- `src/robots.txt`
- Meta tags en `src/app/app.component.ts`

---

### 3. Canonical
- Tags `<link rel="canonical">`
- URLs canónicas dinámicas

#### ⚠️ Impacto
- Canonical incorrecto = contenido duplicado
- Cambios frecuentes = confusión de indexación

#### ✅ Procedimiento obligatorio
1. **Nunca** cambiar dinámicamente sin motivo
2. **Un solo** canonical por página
3. Validar que apunte a la URL correcta con idioma

**Archivos afectados:**
- `src/app/app.component.ts` (método `updateCanonicalUrl`)

---

### 4. Idiomas / hreflang
- Tags `<link rel="alternate" hreflang="...">`
- Mapeo de idiomas a URLs

#### ⚠️ Impacto
- Mezcla de idiomas = confusión en SERPs internacionales
- Hreflang mal configurado = contenido duplicado

#### ✅ Procedimiento obligatorio
1. No mezclar idiomas en una misma página
2. Cada idioma debe apuntar correctamente a su versión
3. Incluir `x-default` para fallback
4. Validar con Google Search Console después de cambios

**Archivos afectados:**
- `src/app/app.component.ts` (método `updateHreflangTags`)
- `src/app/services/language.service.ts`
- `src/assets/i18n/*.json`

---

### 5. Estructura H1
- Tag `<h1>` en cada página
- Jerarquía de encabezados

#### ⚠️ Impacto
- Más de 1 H1 = señal confusa
- Cambios frecuentes = inestabilidad en keywords

#### ✅ Procedimiento obligatorio
1. **Un solo H1 por página**
2. No cambiar frecuentemente (máximo 1 vez cada 3-6 meses)
3. Mantener keyword principal en H1
4. Documentar cambio en changelog

**Archivos afectados:**
- `src/app/components/hero/hero.component.html`
- Archivos i18n: `src/assets/i18n/*.json` (key `hero.title`)

---

### 6. Titles
- Tag `<title>` en cada página
- Títulos dinámicos por idioma

#### ⚠️ Impacto
- Cambios frecuentes = inestabilidad en CTR
- Testing A/B de titles = señal mixta a Google

#### ✅ Procedimiento obligatorio
1. **No rotar** ni testear cada pocos días
2. Cambios mínimos y justificados
3. Longitud óptima: 50-60 caracteres
4. Documentar en changelog con motivo claro

**Archivos afectados:**
- `src/app/app.component.ts` (método `updateMetaTags`)
- `src/assets/i18n/*.json` (key `seo.home.title`)

---

## 🟢 ELEMENTOS SEGUROS (BAJO CONTROL)

Estos elementos se pueden optimizar con **menos riesgo**, pero siempre **registrando cambios**:

### ✅ Meta descriptions
- No afectan ranking directamente
- Afectan CTR en SERPs
- Se pueden probar con más libertad

### ✅ Contenido textual
- Añadir o mejorar contenido es seguro
- Actualizar FAQs, testimonios, precios

### ✅ Performance (Core Web Vitals)
- LCP (Largest Contentful Paint)
- CLS (Cumulative Layout Shift)
- Reducción de JavaScript

### ✅ Schema / datos estructurados (JSON-LD)
- Añadir o actualizar Schema.org es seguro
- Mejora snippets ricos en SERPs

### ✅ Enlaces internos
- Mejorar estructura de enlaces
- Añadir breadcrumbs

### ✅ Accesibilidad
- Alt text en imágenes
- ARIA labels
- Mejora de navegación

---

## 🧪 ENTORNO DE TEST SEO (OBLIGATORIO)

Antes de cualquier cambio crítico en producción:

### 1. Test en local / staging
- **Siempre** con `<meta name="robots" content="noindex, nofollow">` en staging
- Validar con herramientas:
  - **Screaming Frog** (crawling completo)
  - **Lighthouse** (auditoría SEO)
  - **SEOptimer** (análisis pre-producción)

### 2. Checklist pre-producción
- [ ] URLs intactas (o 301 configurados)
- [ ] Canonicals correctos
- [ ] Noindex solo en staging (remover en prod)
- [ ] Titles/H1 revisados
- [ ] Hreflang validado
- [ ] Sitemap actualizado
- [ ] robots.txt correcto

**Ver también:**
- [Cómo ejecutar tests SEO](../how-to/ejecutar-tests-seo.md)
- [Guía de despliegue](../how-to/desplegar.md)

---

## 📊 Ver también
- [SEO Changelog](./seo-changelog.md) — Histórico de todos los cambios
- [Estado actual SEO](./estado-seo.md) — Inventario completo
- [Cómo hacer cambios SEO seguros](../how-to/cambios-seo-seguros.md) — Guía paso a paso
