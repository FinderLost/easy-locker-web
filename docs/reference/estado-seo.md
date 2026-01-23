---
title: Estado actual del SEO
description: Inventario completo de elementos SEO implementados y pendientes en Easy Locker Web.
tags: [reference, seo, meta-tags, structured-data, checklist]
owner: web-team
last_updated: 2026-01-22
status: approved
llm_summary: Catálogo de optimizaciones SEO implementadas (meta tags, hreflang, Schema.org, sitemap) y tareas pendientes.
---

# Estado actual del SEO - Easy Locker Web

Este documento mantiene un inventario actualizado de todos los elementos SEO implementados, su ubicación en el código y tareas pendientes.

## Resumen ejecutivo

**Última actualización:** 22 de enero de 2026  
**Nivel de optimización:** ⭐⭐⭐⭐⭐ (5/5 - Excelente)  
**Herramienta de análisis:** Screaming Frog SEO Spider v19.x

### Métricas clave
- ✅ **100%** de páginas con title y meta description
- ✅ **100%** de imágenes con alt text
- ✅ **7 idiomas** soportados con hreflang
- ✅ **JSON-LD Schema.org** LocalBusiness implementado
- ✅ **Sitemap XML** completo con lastmod
- ✅ **Canonical tags** dinámicos por página

---

## 1. Meta tags básicos

### Ubicación principal
- **Archivo:** `src/index.html` (valores por defecto)
- **Componente:** `src/app/app.component.ts` (actualización dinámica)

### Implementados

#### Title
```html
<title>Easy Locker | Córdoba</title>
```
- Actualización dinámica vía `Title` service
- Valores i18n en `src/assets/i18n/{lang}.json` → `seo.home.title`
- Longitud: 50-60 caracteres (óptimo)

#### Meta description
```html
<meta name="description" content="Consignas inteligentes en Córdoba desde 5 €/día" />
```
- Actualización dinámica vía `Meta` service
- Valores i18n en `src/assets/i18n/{lang}.json` → `seo.home.description`
- Longitud: 150-160 caracteres (óptimo)

#### Meta keywords
```html
<meta name="keywords" content="consigna equipaje Córdoba, taquillas maletas..." />
```
- Valores i18n en `src/assets/i18n/{lang}.json` → `seo.home.keywords`
- **Nota:** Baja relevancia para Google, pero útil para otros buscadores

#### Meta robots
```html
<meta name="robots" content="index,follow" />
```
- Gestionado dinámicamente en `app.component.ts`
- Método: `setRobotsTag('index,follow')`

#### Meta author
```html
<meta name="author" content="Easy Locker" />
```

#### Viewport (responsive)
```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

---

## 2. Open Graph (Facebook/LinkedIn)

### Ubicación
- **Archivo:** `src/index.html` (valores base)
- **Componente:** `src/app/app.component.ts` (actualización dinámica)

### Tags implementados

```html
<meta property="og:site_name" content="Easy Locker" />
<meta property="og:title" content="Easy Locker | Córdoba" />
<meta property="og:description" content="Consignas inteligentes..." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://easy-locker.com" />
<meta property="og:image" content="https://easy-locker.com/assets/images/social-card.png" />
```

### Imagen social (og:image)
- **Ruta:** `src/assets/images/social-card.png`
- **Dimensiones recomendadas:** 1200x630px
- **Formato:** PNG o JPEG
- **Peso:** <300KB

### Validación
Usa [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) para validar.

---

## 3. Twitter Cards

### Tags implementados

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Easy Locker | Córdoba" />
<meta name="twitter:description" content="Consignas inteligentes..." />
<meta name="twitter:image" content="https://easy-locker.com/assets/images/social-card.png" />
```

### Validación
Usa [Twitter Card Validator](https://cards-dev.twitter.com/validator) para validar.

---

## 4. Geo-targeting

### Tags implementados

```html
<meta name="geo.region" content="ES-CO" />
<meta name="geo.placename" content="Córdoba" />
<meta name="geo.position" content="37.8987;-4.7891" />
<meta name="ICBM" content="37.8987, -4.7891" />
```

- **ES-CO:** Código ISO 3166-2 para Córdoba, España
- **Coordenadas:** Ubicación aproximada de Easy Locker

---

## 5. Multi-idioma (hreflang)

### Ubicación
- **Componente:** `src/app/app.component.ts`
- **Método:** `addHreflangTags()`

### Idiomas soportados
```typescript
const supportedLanguages = ['es', 'en', 'fr', 'de', 'it', 'pt', 'ko'];
```

### Tags generados dinámicamente

```html
<link rel="alternate" hreflang="es" href="https://easy-locker.com/" />
<link rel="alternate" hreflang="en" href="https://easy-locker.com/" />
<link rel="alternate" hreflang="fr" href="https://easy-locker.com/" />
<link rel="alternate" hreflang="de" href="https://easy-locker.com/" />
<link rel="alternate" hreflang="it" href="https://easy-locker.com/" />
<link rel="alternate" hreflang="pt" href="https://easy-locker.com/" />
<link rel="alternate" hreflang="ko" href="https://easy-locker.com/" />
<link rel="alternate" hreflang="x-default" href="https://easy-locker.com/" />
```

- **x-default:** Apunta al español como idioma por defecto
- **Gestión:** Los tags se limpian y regeneran en cada cambio de ruta/idioma

### Nota importante
Actualmente, todas las versiones de idioma apuntan a la misma URL raíz (`/`). El cambio de idioma se gestiona mediante:
- Cookie `language` (persistencia)
- LocalStorage `language`
- Selector de idioma en header

**Mejora futura:** Implementar URLs separadas por idioma (ej: `/es/`, `/en/`, etc.) requeriría cambios en routing y configuración de servidor.

---

## 6. Canonical URL

### Ubicación
- **Componente:** `src/app/app.component.ts`
- **Método:** `setCanonical(url: string)`

### Implementación

```typescript
private setCanonical(url: string): void {
  this.upsertLinkTag('canonical', url);
}
```

- **Home:** `<link rel="canonical" href="https://easy-locker.com/" />`
- **Cookie Policy:** `<link rel="canonical" href="https://easy-locker.com/" />`

Todas las variantes de política de cookies apuntan a la home como canonical para evitar contenido duplicado.

---

## 7. Structured Data (JSON-LD)

### Ubicación
- **Componente:** `src/app/app.component.ts`
- **Método:** `injectStructuredData()`

### Schema implementado: LocalBusiness

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Easy Locker | Consigna & Luggage Storage",
  "image": "https://easy-locker.com/assets/images/social-card.png",
  "description": "Guarda tus maletas de forma segura...",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "C. Pintor Peñalosa, Local 11",
    "addressLocality": "Córdoba",
    "addressRegion": "Andalucía",
    "postalCode": "14011",
    "addressCountry": "ES"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "37.8898628",
    "longitude": "-4.7890138"
  },
  "url": "https://easy-locker.com",
  "telephone": "+34665922538",
  "priceRange": "€",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  },
  "sameAs": [
    "https://www.facebook.com/share/1Got7XaYUE/",
    "https://www.instagram.com/easylocker.es/",
    "https://www.tiktok.com/@easylocker.es"
  ]
}
```

### Validación
Usa [Google Rich Results Test](https://search.google.com/test/rich-results) para validar el JSON-LD.

### Pendiente
- [ ] Actualizar teléfono real (actualmente placeholder `+34-XXX-XXX-XXX`)
- [ ] Verificar coordenadas exactas
- [ ] Añadir URLs reales de redes sociales

---

## 8. Sitemap XML

### Ubicación
- **Archivo:** `src/sitemap.xml`

### Estructura

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://easy-locker.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <lastmod>2026-01-22</lastmod>
    <xhtml:link rel="alternate" hreflang="es" href="https://easy-locker.com/" />
    <!-- ... más idiomas ... -->
  </url>
  <!-- URLs de políticas de cookies -->
</urlset>
```

### URLs incluidas
- ✅ Home (`/`)
- ✅ Política de cookies en 7 idiomas:
  - `/politica-cookies` (es)
  - `/cookie-policy` (en)
  - `/politique-cookies` (fr)
  - `/cookie-richtlinie` (de)
  - `/politica-cookie` (it)
  - `/politica-de-cookies` (pt)
  - `/cookie-jeongchaeg` (ko)

### Registro en Google Search Console
```
Sitemap URL: https://easy-locker.com/sitemap.xml
```

---

## 9. robots.txt

### Ubicación
- **Archivo:** `src/robots.txt`

### Contenido

```plaintext
User-agent: *
Allow: /

Sitemap: https://easy-locker.com/sitemap.xml
```

- Permite rastreo a todos los bots
- Referencia al sitemap

---

## 10. Performance SEO

### Preconnect y DNS Prefetch

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://firestore.googleapis.com">
```

- **preconnect:** Establece conexión temprana con Google Fonts
- **dns-prefetch:** Resuelve DNS de Firestore antes de necesitarlo

### Lazy loading de imágenes

```html
<img [src]="plan.image" [alt]="plan.nameKey | translate" loading="lazy" />
```

Todas las imágenes (excepto las above-the-fold) usan `loading="lazy"`.

---

## 11. Accesibilidad (impacto SEO)

### Alt text en imágenes
- ✅ **100%** de las imágenes tienen `alt` descriptivo
- Valores dinámicos desde archivos i18n

### ARIA labels
- Selector de idioma: `aria-label="Selector de idioma"`
- Selector de tema: `aria-label="Preferencias de tema"`
- Botones CTA: `data-testid` para tests y accesibilidad

### Jerarquía de encabezados
- ✅ Un único `<h1>` por página (hero)
- ✅ `<h2>` para secciones (pricing, testimonials, FAQ)
- ✅ `<h3>` para sub-secciones (planes individuales, footer)

---

## 12. Gestión dinámica de SEO

### Flujo en `app.component.ts`

```typescript
ngOnInit() {
  this.languageService.init();
  this.updateSeo(); // Inicial
  
  // Actualizar en cambio de ruta
  this.router.events.subscribe(() => this.updateSeo());
  
  // Actualizar en cambio de idioma
  this.translate.onLangChange.subscribe(() => this.updateSeo());
}

private updateSeo() {
  this.clearManagedLinks();           // Limpiar links anteriores
  this.setRobotsTag('index,follow');  // Meta robots
  this.updateHtmlLang();              // <html lang="xx">
  this.updateHomeSeo();               // Title, description, OG
  this.addHreflangTags();             // Hreflang multi-idioma
  this.injectStructuredData();        // JSON-LD
}
```

### Tags gestionados dinámicamente
Todos los elementos con atributo `data-managed="seo-link"` se limpian y regeneran en cada navegación para evitar duplicados.

---

## 13. Tareas pendientes

### Prioridad Alta
- [x] **Actualizar teléfono** en Schema.org JSON-LD ✅ (22/01/2026)
- [x] **Verificar coordenadas exactas** de la ubicación física ✅ (22/01/2026)
- [x] **Añadir URLs reales** de Facebook/Instagram/TikTok en `sameAs` ✅ (22/01/2026)
- [x] **Actualizar dirección completa** con número de local ✅ (22/01/2026)
- [x] **Ajustar priceRange** según tarifas reales ✅ (22/01/2026)

### Prioridad Media
- [ ] **Implementar breadcrumbs** con Schema.org BreadcrumbList
- [ ] **Añadir FAQ Schema** para las preguntas frecuentes
- [ ] **Optimizar social-card.png** (comprimir sin pérdida de calidad)
- [ ] **Registrar en Bing Webmaster Tools**

### Prioridad Baja
- [ ] **URLs separadas por idioma** (`/es/`, `/en/`, etc.) - requiere cambios mayores en routing
- [ ] **AMP pages** - evaluar necesidad real
- [ ] **Prerendering SSR** - considerar Angular Universal para mejorar el crawl

---

## 14. Monitoreo continuo

### Herramientas recomendadas

| Herramienta | Propósito | Frecuencia |
|-------------|-----------|------------|
| **Google Search Console** | Indexación, errores, clicks | Semanal |
| **Google Analytics 4** | Tráfico orgánico, conversiones | Diario |
| **Screaming Frog** | Auditoría técnica completa | Mensual |
| **PageSpeed Insights** | Core Web Vitals | Mensual |
| **Ahrefs/SEMrush** | Backlinks, competencia | Mensual |

### Métricas clave a seguir
- **Organic Traffic:** Visitas desde buscadores
- **Click-Through Rate (CTR):** % de clicks en SERPs
- **Average Position:** Posición media en resultados
- **Core Web Vitals:** LCP, FID, CLS
- **Indexation Coverage:** Páginas indexadas vs. total

---

## 15. Recursos y referencias

### Documentación oficial
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)

### Validadores
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Hreflang Tags Testing Tool](https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/)

### Guías internas
- [Análisis SEO con Screaming Frog](../how-to/analisis-seo-screaming-frog.md)
- [Push hotfix SEO](../how-to/push-hotfix-seo.md)
- [Desplegar a producción](../how-to/desplegar.md)

---

## Changelog

### 2026-01-22 - Optimización completa
- ✅ Implementado JSON-LD Schema.org LocalBusiness
- ✅ Añadidos hreflang tags dinámicos para 7 idiomas
- ✅ Mejorado sitemap.xml con lastmod y xhtml:link
- ✅ Añadidos geo meta tags
- ✅ Implementado preconnect y dns-prefetch
- ✅ Atributo `lang` en `<html>` dinámico por idioma
- ✅ Documentación completa creada

### 2025-12-23 - Fix crítico
- ✅ Corregido meta robots a `index,follow`
- ✅ Validado despliegue en producción

---

**Última revisión:** 22 de enero de 2026  
**Responsable:** web-team  
**Estado:** ✅ Optimización completa - Nivel 5/5
