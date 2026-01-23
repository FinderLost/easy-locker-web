---
title: Análisis SEO con Screaming Frog
description: Guía completa para analizar el sitio web con Screaming Frog SEO Spider y optimizar el posicionamiento.
tags: [how-to, seo, screaming-frog, análisis, optimización]
owner: web-team
last_updated: 2026-01-22
status: approved
llm_summary: Procedimiento para instalar y usar Screaming Frog SEO Spider en local, analizar el sitio, detectar problemas SEO y aplicar mejoras.
---

# Análisis SEO con Screaming Frog

Esta guía describe cómo realizar un análisis SEO completo del sitio Easy Locker Web usando Screaming Frog SEO Spider para detectar y corregir problemas de optimización.

## Requisitos previos

- **Screaming Frog SEO Spider** instalado (versión free o licenciada)
  - Descarga: [https://www.screamingfrog.co.uk/seo-spider/](https://www.screamingfrog.co.uk/seo-spider/)
  - Disponible para macOS, Windows y Linux
- Servidor de desarrollo local corriendo (`npm start`)
- Navegador web para revisar resultados

## Instalación de Screaming Frog

### macOS
```bash
# Opción 1: Descarga directa desde el sitio web
# https://www.screamingfrog.co.uk/seo-spider/

# Opción 2: Homebrew (si está disponible)
brew install --cask screaming-frog-seo-spider
```

### Windows
1. Descarga el instalador desde [screamingfrog.co.uk](https://www.screamingfrog.co.uk/seo-spider/)
2. Ejecuta el archivo `.exe` y sigue el asistente de instalación

### Linux
```bash
# Descarga el paquete .deb o .rpm según tu distribución
wget https://download.screamingfrog.co.uk/products/seo-spider/ScreamingFrogSEOSpider-XX.X.amd64.deb
sudo dpkg -i ScreamingFrogSEOSpider-XX.X.amd64.deb
```

## Paso 1: Levantar el servidor local

Antes de analizar, asegúrate de que el sitio esté corriendo localmente:

```bash
cd /ruta/a/easy-locker-web
npm start
```

El servidor estará disponible en `http://localhost:4200/`

## Paso 2: Configurar Screaming Frog

1. **Abre Screaming Frog SEO Spider**
2. **Configura el modo de rastreo:**
   - Ve a `Configuration > Spider > Basic`
   - Marca: **Crawl All Subdomains** (deshabilitado para análisis local)
   - Marca: **Crawl Images** (habilitado)
   - Marca: **Crawl JavaScript** (habilitado - importante para Angular)

3. **Configura el renderizado JavaScript:**
   - Ve a `Configuration > Spider > Rendering`
   - Selecciona: **JavaScript Rendering > JavaScript**
   - Esto es crucial porque Easy Locker es una SPA de Angular

4. **Configura User-Agent:**
   - Ve a `Configuration > User-Agent`
   - Selecciona: **Googlebot Smartphone** (para simular rastreo móvil)
   - O usa **Desktop** según el análisis que necesites

## Paso 3: Ejecutar el análisis

1. En la barra superior de Screaming Frog, ingresa: `http://localhost:4200`
2. Haz clic en **Start**
3. Espera a que el rastreo termine (puede tardar 1-5 minutos dependiendo del tamaño)

## Paso 4: Analizar los resultados

### 4.1 Vista general (Overview)
Revisa el resumen de:
- Total de URLs rastreadas
- Códigos de respuesta HTTP
- URLs indexables vs. no indexables

### 4.2 Títulos de página (Page Titles)
**Pestaña: Page Titles**

Verifica:
- ✅ Todas las páginas tienen `<title>`
- ✅ Longitud entre 50-60 caracteres (óptimo para Google)
- ❌ No hay títulos duplicados
- ❌ No hay títulos demasiado largos (>70 caracteres)

**Filtros útiles:**
- `Missing` - páginas sin título
- `Duplicate` - títulos repetidos
- `Over 70 Characters` - títulos largos

### 4.3 Meta descripciones (Meta Description)
**Pestaña: Meta Description**

Verifica:
- ✅ Todas las páginas importantes tienen meta description
- ✅ Longitud entre 150-160 caracteres
- ❌ No hay descripciones duplicadas
- ❌ No hay descripciones demasiado cortas (<50) o largas (>160)

### 4.4 Encabezados (H1, H2)
**Pestaña: H1 / H2**

Verifica:
- ✅ Cada página tiene exactamente un `<h1>`
- ✅ Jerarquía de encabezados correcta (H1 > H2 > H3)
- ❌ No hay múltiples H1 en la misma página
- ❌ No hay páginas sin H1

### 4.5 Imágenes (Images)
**Pestaña: Images**

Verifica:
- ✅ Todas las imágenes tienen atributo `alt`
- ✅ Tamaños de imagen optimizados (<200KB preferiblemente)
- ✅ Formatos modernos (WebP, AVIF cuando sea posible)
- ❌ No hay imágenes sin `alt` text

**Filtro:** `Missing Alt Text`

### 4.6 Enlaces internos (Links)
**Pestaña: Internal / External**

Verifica:
- ✅ No hay enlaces rotos (404)
- ✅ Enlaces internos usan rutas relativas o absolutas correctas
- ❌ No hay redirecciones innecesarias (3XX)

### 4.7 Canonical y Hreflang
**Pestaña: Directives**

Verifica:
- ✅ Canonical tags presentes y correctos
- ✅ Hreflang tags para sitios multi-idioma
- ❌ No hay conflictos de canonical

### 4.8 Schema Markup (JSON-LD)
**Pestaña: Structured Data**

Verifica:
- ✅ Schema.org LocalBusiness presente
- ✅ Datos estructurados válidos
- Usa [Google Rich Results Test](https://search.google.com/test/rich-results) para validar

### 4.9 Velocidad y rendimiento
**Pestaña: Page Speed**

(Requiere integración con Google PageSpeed Insights API)

Revisa:
- Core Web Vitals (LCP, FID, CLS)
- Tiempo de carga
- Oportunidades de mejora

## Paso 5: Exportar resultados

1. Ve a **Bulk Export > Response Codes > All**
2. Guarda el archivo CSV con fecha: `screaming-frog-analisis-YYYY-MM-DD.csv`
3. Revisa problemas específicos y prioriza correcciones

## Checklist de elementos SEO implementados

Tras el análisis y las mejoras aplicadas (enero 2026):

### ✅ Meta tags básicos
- [x] Title dinámico por página/idioma
- [x] Meta description dinámico
- [x] Meta keywords
- [x] Meta robots (index,follow)
- [x] Meta author

### ✅ Open Graph y Twitter Cards
- [x] og:title, og:description, og:image
- [x] og:url, og:type, og:site_name
- [x] twitter:card, twitter:title, twitter:description, twitter:image

### ✅ Geo-targeting
- [x] geo.region, geo.placename
- [x] geo.position, ICBM

### ✅ Multi-idioma
- [x] Hreflang tags dinámicos (es, en, fr, de, it, pt, ko)
- [x] x-default apuntando a español
- [x] Atributo `lang` en `<html>` dinámico

### ✅ Structured Data (JSON-LD)
- [x] Schema.org LocalBusiness
- [x] Dirección completa
- [x] Coordenadas geográficas
- [x] Horarios de apertura (24/7)
- [x] Rango de precios

### ✅ Sitemap y robots
- [x] sitemap.xml con todas las URLs multi-idioma
- [x] robots.txt optimizado
- [x] lastmod en sitemap

### ✅ Performance
- [x] Preconnect a Google Fonts y Firestore
- [x] DNS prefetch para APIs externas
- [x] Lazy loading en imágenes
- [x] Favicon adaptativo (light/dark theme)

### ✅ Accesibilidad y UX
- [x] Alt text en todas las imágenes
- [x] Jerarquía de encabezados correcta (H1 único por página)
- [x] ARIA labels en controles interactivos
- [x] Responsive design

## Problemas comunes y soluciones

### Problema: "Missing H1"
**Solución:** Verifica que cada página/componente tenga un `<h1>` único.

```html
<!-- Correcto -->
<h1>{{ 'h1' | translate }}</h1>

<!-- Incorrecto: múltiples H1 -->
<h1>Título 1</h1>
<h1>Título 2</h1>
```

### Problema: "Duplicate Meta Description"
**Solución:** Asegúrate de que cada página tenga descripciones únicas en los archivos i18n.

```json
{
  "seo": {
    "home": {
      "description": "Descripción única de la home"
    },
    "cookiePolicy": {
      "description": "Descripción única de política de cookies"
    }
  }
}
```

### Problema: "Missing Alt Text"
**Solución:** Añade alt text descriptivo a todas las imágenes.

```html
<!-- Correcto -->
<img [src]="plan.image" [alt]="plan.nameKey | translate" />

<!-- Incorrecto -->
<img [src]="plan.image" />
```

### Problema: "Canonical pointing to different domain"
**Solución:** Verifica que `baseUrl` en `app.component.ts` sea el correcto.

```typescript
private readonly baseUrl = 'https://easy-locker.com';
```

## Análisis de producción

Para analizar el sitio en producción:

1. En Screaming Frog, ingresa: `https://easy-locker.com`
2. Sigue los mismos pasos del análisis local
3. Compara resultados local vs. producción
4. Detecta diferencias y corrige en el código fuente

## Herramientas complementarias

Además de Screaming Frog, usa:

- **Google Search Console** - Monitorea indexación y errores
- **Google PageSpeed Insights** - Analiza velocidad y Core Web Vitals
- **Google Rich Results Test** - Valida Schema.org JSON-LD
- **Lighthouse** (Chrome DevTools) - Auditoría completa (SEO, Performance, Accessibility)
- **Ahrefs / SEMrush** - Análisis de competencia y backlinks

## Automatización (opcional)

Para análisis programáticos, Screaming Frog ofrece CLI:

```bash
# Ejemplo: rastrear sitio y exportar CSV
screamingfrogseospider --crawl http://localhost:4200 \
  --output-folder ./seo-reports \
  --save-crawl \
  --export-tabs "Internal:All,Images:Missing Alt Text,H1:All"
```

## Frecuencia recomendada

- **Desarrollo:** Antes de cada release mayor
- **Producción:** Mensual o tras cambios significativos de contenido
- **Auditorías completas:** Trimestral

## See also

- [Push hotfix SEO](push-hotfix-seo.md) - Procedimiento para desplegar fixes críticos
- [Desplegar a producción](desplegar.md) - Proceso de deploy
- [Editar contenido](editar-contenido.md) - Cómo actualizar textos e imágenes
- [Documentación oficial Screaming Frog](https://www.screamingfrog.co.uk/seo-spider/user-guide/)
