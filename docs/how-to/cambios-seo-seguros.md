---
title: Cómo hacer cambios SEO seguros
description: Guía paso a paso para modificar elementos SEO sin riesgos, con checklist de validación.
tags: [how-to, seo, workflow, checklist, validation]
owner: web-team
last_updated: 2026-01-25
status: approved
llm_summary: Procedimiento completo para cambios SEO: identificar criticidad, testear en local/staging, registrar en changelog, validar y desplegar.
---

# Cómo hacer cambios SEO seguros

Esta guía te ayudará a realizar cambios en elementos SEO sin provocar caídas en rankings ni pérdida de señales.

## 📋 Proceso general

```
1. Identificar tipo de cambio
   ↓
2. Verificar criticidad
   ↓
3. [Si crítico] → Justificar y planificar
   ↓
4. Testear en local
   ↓
5. Testear en staging
   ↓
6. Registrar en changelog
   ↓
7. Desplegar a producción
   ↓
8. Validar en producción
```

---

## Paso 1: Identificar el tipo de cambio

¿Qué elemento vas a cambiar?

### Elementos críticos 🔴
- URLs (rutas, slugs, idiomas)
- robots.txt (disallow, noindex)
- Canonical tags
- Hreflang (idiomas)
- H1
- Titles

**→ Requiere proceso completo (todos los pasos)**

### Elementos seguros 🟢
- Meta descriptions
- Contenido textual
- Performance (LCP, CLS, JS)
- Schema.org / JSON-LD
- Enlaces internos
- Accesibilidad

**→ Proceso simplificado (opcional registro)**

**Consulta:** [Normas críticas SEO](../reference/normas-criticas-seo.md)

---

## Paso 2: Verificar criticidad

### 🔍 Detección automática

Antes de empezar, ejecuta el detector de cambios SEO:

```bash
npm run seo:check
```

Este script analiza automáticamente:
- Archivos críticos modificados
- Patrones SEO en el diff
- Existencia de registro en changelog

### Si el cambio es CRÍTICO:

#### ✅ Checklist pre-inicio
- [ ] ¿Está justificado el cambio?
- [ ] ¿Hay datos que lo respalden?
- [ ] ¿Se ha consultado con el equipo?
- [ ] ¿Hay alternativas menos invasivas?

#### ⚠️ Si la respuesta a cualquiera es NO → DETENER

---

## Paso 3: Justificar y planificar

### Documenta ANTES de codificar

Crea una entrada en [SEO Changelog](../reference/seo-changelog.md) con:

```markdown
### [PLANIFICADO] YYYY-MM-DD: [Tipo] — [Elemento]
**Responsable:** [tu nombre]  
**Tipo:** [URL|Title|H1|Canonical|Hreflang|Robots|Schema]  
**Motivo:** [Justificación clara]  
**Impacto esperado:** [Positivo/Neutral/Negativo]  

**Archivos a modificar:**
- `ruta/archivo1.ts`
- `ruta/archivo2.json`

**Plan de validación:**
- [ ] Test local
- [ ] Test staging
- [ ] Validación producción
```

---

## Paso 4: Testear en local

### 4.1. Levantar servidor de desarrollo
```bash
npm start
```

### 4.2. Verificar cambios
- Abrir DevTools → Pestaña Elements
- Inspeccionar `<head>`:
  - `<title>`
  - `<meta name="description">`
  - `<link rel="canonical">`
  - `<link rel="alternate" hreflang="...">`
  - `<meta name="robots">`

### 4.3. Ejecutar Lighthouse
```bash
# En Chrome DevTools → Lighthouse → SEO
# Objetivo: 100/100
```

### 4.4. Verificar errores de consola
- No debe haber errores JavaScript
- No debe haber warnings de Angular

---

## Paso 5: Testear en staging

### 5.1. Asegurar que staging tiene noindex
Verificar que existe:
```html
<meta name="robots" content="noindex, nofollow">
```

**⚠️ CRÍTICO:** Si staging no tiene noindex, puede ser indexado por Google.

### 5.2. Ejecutar Screaming Frog

**Ver:** [Ejecutar tests SEO](./ejecutar-tests-seo.md)

```bash
# Crawl completo de staging
# URL: https://staging.easylocker.com (o URL de staging)
```

#### Checklist Screaming Frog
- [ ] Todas las páginas responden 200
- [ ] No hay cadenas de redirects
- [ ] Todos los canonicals apuntan correctamente
- [ ] Hreflang sin errores
- [ ] Imágenes con alt text
- [ ] H1 único en cada página
- [ ] Meta descriptions presentes

### 5.3. Validar cambios específicos

#### Si cambiaste URLs:
- [ ] 301 redirects funcionan
- [ ] Sitemap.xml actualizado
- [ ] Enlaces internos actualizados

#### Si cambiaste Titles/H1:
- [ ] Longitud correcta (50-60 chars para title)
- [ ] Keywords principales presentes
- [ ] Sin duplicados

#### Si cambiaste Hreflang:
- [ ] Todos los idiomas presentes
- [ ] x-default configurado
- [ ] URLs correctas por idioma

---

## Paso 6: Registrar en changelog

Actualiza la entrada en [SEO Changelog](../reference/seo-changelog.md):

```markdown
### ✅ 2026-MM-DD: [Tipo] — [Elemento]
...
**Validación:**
- [x] Test en local
- [x] Test en staging con Screaming Frog
- [ ] Verificado en producción ← pendiente

**Notas:**
[Cualquier hallazgo importante durante testing]
```

**Commit el changelog junto con el código:**
```bash
git add docs/reference/seo-changelog.md
git commit -m "docs: registrar cambio SEO en [elemento]"
```

---

## Paso 7: Desplegar a producción

### 7.1. Merge a main
```bash
git checkout main
git merge feature/seo-cambio-x
```

### 7.2. Ejecutar deployment

**Ver:** [Cómo desplegar](./desplegar.md)

```bash
npm run deploy
# O según flujo de GitHub Actions
```

### 7.3. Esperar propagación
- GitHub Pages: ~1-5 minutos
- DNS/CDN: hasta 24 horas (poco común)

---

## Paso 8: Validar en producción

### 8.1. Verificar en vivo
```bash
# Abrir URL de producción
open https://easylocker.com
```

### 8.2. Checklist post-deploy
- [ ] Página carga correctamente
- [ ] Meta tags correctos (DevTools)
- [ ] Canonical apunta a producción
- [ ] **robots.txt SIN noindex** ⚠️
- [ ] Lighthouse SEO: 100/100

### 8.3. Ejecutar Screaming Frog en producción
```bash
# Crawl de producción
# Comparar con crawl de staging
```

### 8.4. Verificar en Google Search Console
1. Ir a https://search.google.com/search-console
2. Inspeccionar URL modificada
3. Solicitar reindexación si es cambio crítico

### 8.5. Monitorear durante 7-14 días
- Tráfico orgánico (Google Analytics)
- Posiciones (Google Search Console)
- Errores de rastreo

---

## 🔧 Herramientas necesarias

### Esenciales
- **Screaming Frog SEO Spider** (v19+)
- **Chrome DevTools** (Lighthouse)
- **Google Search Console**

### Opcionales pero recomendadas
- **SEOptimer** (análisis rápido)
- **Google Analytics** (monitoreo tráfico)
- **Ahrefs / Semrush** (tracking rankings)

---

## ⚠️ Qué hacer si algo sale mal

### Caída súbita de tráfico post-deploy

1. **Revertir inmediatamente**
   ```bash
   git revert HEAD
   npm run deploy
   ```

2. **Diagnosticar el problema**
   - Comparar HTML antes/después (git diff)
   - Revisar errores en Google Search Console
   - Verificar robots.txt

3. **Documentar el incidente**
   - Actualizar changelog con estado de rollback
   - Añadir notas sobre qué falló

4. **Planificar fix correcto**
   - Volver al paso 1 (identificar cambio)
   - Re-testar exhaustivamente

---

## 🎯 Casos de uso comunes

### Cambiar title de homepage
```
Criticidad: 🔴 ALTA
Archivos: src/assets/i18n/es.json (key: seo.home.title)
Testing: Lighthouse + Screaming Frog
Tiempo estimado: 1-2 horas (incluyendo validación)
```

**Ver ejemplo completo:** [SEO Changelog - Entrada de títulos](../reference/seo-changelog.md)

### Añadir nueva FAQ
```
Criticidad: 🟢 BAJA
Archivos: src/assets/i18n/*.json (keys: faq_qN, faq_aN)
Testing: Lighthouse (opcional)
Tiempo estimado: 15-30 minutos
```

### Cambiar URL de página
```
Criticidad: 🔴 CRÍTICA
Archivos: 
  - src/app/app-routing.module.ts
  - src/sitemap.xml
  - Posible archivo de redirects
Testing: OBLIGATORIO Screaming Frog + validación 301s
Tiempo estimado: 2-4 horas
```

---

## � Sistema de alertas automático

### Script de validación local

El proyecto incluye un script de detección automática:

```bash
# Modo informativo (solo alerta)
npm run seo:check

# Modo estricto (bloquea si no hay registro)
npm run seo:check:strict
```

**Ubicación:** `scripts/detect-seo-changes.js`

### Integración en CI/CD (opcional)

Para activar alertas automáticas en PRs:

1. **Copiar template:**
   ```bash
   cp docs/reference/github-actions-seo-template.yml .github/workflows/seo-check.yml
   ```

2. **Configurar según necesidades** (editar `.github/workflows/seo-check.yml`)

3. **Resultado:** Cada PR con cambios críticos recibirá un comentario automático

**Ver:** [Template de GitHub Actions](../reference/github-actions-seo-template.yml)

### Qué detecta el script

- ✅ Archivos críticos modificados (routing, robots.txt, meta tags, i18n)
- ✅ Patrones críticos en el diff (title, H1, canonical, hreflang, noindex)
- ✅ Existencia de registro en changelog
- ⚠️ Alertas si falta documentación

---

## �📊 Ver también
- [Normas críticas de SEO](../reference/normas-criticas-seo.md)
- [SEO Changelog](../reference/seo-changelog.md)
- [Ejecutar tests SEO](./ejecutar-tests-seo.md)
- [Estado actual SEO](../reference/estado-seo.md)
- [Cómo desplegar](./desplegar.md)
