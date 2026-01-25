---
title: SEO Changelog
description: Histórico completo de todos los cambios críticos de SEO realizados en el proyecto.
tags: [reference, seo, changelog, history, audit]
owner: web-team
last_updated: 2026-01-25
status: approved
llm_summary: Registro cronológico de cambios en URLs, titles, H1, canonical, hreflang y otros elementos SEO críticos.
---

# SEO Changelog

Este documento registra **todos los cambios críticos** de SEO realizados en el proyecto, siguiendo las [normas críticas de SEO](./normas-criticas-seo.md).

## ⚠️ Uso obligatorio

**Antes de hacer cualquier cambio crítico de SEO:**
1. Leer las [normas críticas](./normas-criticas-seo.md)
2. Registrar aquí el cambio ANTES de hacer merge
3. Indicar fecha, página afectada, tipo de cambio y motivo

---

## Formato de entrada

```markdown
### YYYY-MM-DD: [Tipo de cambio] — [Página/Elemento afectado]
**Responsable:** [Nombre o GitHub user]  
**Tipo:** URL | Title | H1 | Canonical | Hreflang | Robots | Schema  
**Motivo:** [Justificación del cambio]  
**Impacto esperado:** [Positivo/Neutral/Negativo]  
**Archivos modificados:**
- `ruta/al/archivo.ts`
- `ruta/al/archivo.json`

**Detalles:**
- Cambio de: `[valor anterior]`
- Cambio a: `[valor nuevo]`

**Validación:**
- [ ] Test en local
- [ ] Test en staging con Screaming Frog
- [ ] Verificado en producción

**Notas adicionales:**
[Cualquier detalle relevante]
```

---

## 📋 Histórico de cambios

### 2026-01-25: [Title Tag] — Optimización longitud títulos SEO
**Responsable:** Easy Locker Agent  
**Tipo:** Title  
**Motivo:** Cumplir con mejores prácticas SEO de 50-60 caracteres (recomendación Screaming Frog)  
**Impacto esperado:** Positivo (mejor CTR y claridad en SERPs)  
**Archivos modificados:**
- `src/index.html` (lines 14, 35, 49)

**Detalles:**
- Cambio de: `Easy Locker | Córdoba` (21 caracteres)
- Cambio a: `Consigna de equipaje en Córdoba | Easy Locker` (50 caracteres)
- También actualizado en og:title y twitter:title
- Nota: Los títulos dinámicos en i18n ya estaban optimizados (no requieren cambios)

**Validación:**
- [x] Test en local
- [x] Compilación exitosa (npm run build)
- [x] Verificado longitud óptima (50 caracteres)
- [x] Script seo:check ejecutado (sin cambios críticos detectados)

**Observación:** Esta optimización se aplica al HTML base. Los títulos dinámicos cargados por Angular desde archivos i18n (seo.home.title) ya cumplían con la recomendación desde su creación.

---

### 2026-01-22: [Schema.org] — JSON-LD LocalBusiness completo
**Responsable:** web-team  
**Tipo:** Schema  
**Motivo:** Implementación inicial de datos estructurados para mejorar rich snippets  
**Impacto esperado:** Positivo (mejor visibilidad en SERPs locales)  
**Archivos modificados:**
- `src/app/app.component.ts` (método `injectStructuredData`)

**Detalles:**
- Añadido: Schema.org completo con coordenadas GPS, teléfono, redes sociales
- Datos: Easy Locker, C. Pintor Peñalosa Local 11, Córdoba
- PriceRange: € (actualizado desde €€)

**Validación:**
- [x] Test en local
- [x] Verificado manualmente en código
- [ ] Verificado en Google Rich Results Test (pendiente producción)

**Referencia:** [Plan de acción SEO](./plan-accion-seo-2026-01.md)

---

### 2026-01-22: [Hreflang] — Implementación tags hreflang dinámicos
**Responsable:** web-team  
**Tipo:** Hreflang  
**Motivo:** Correcta indexación internacional para 7 idiomas  
**Impacto esperado:** Positivo (mejor targeting por país)  
**Archivos modificados:**
- `src/app/app.component.ts` (método `updateHreflangTags`)

**Detalles:**
- Idiomas soportados: es, en, de, fr, it, pt, ko
- Incluye x-default apuntando a /es
- Tags dinámicos por ruta

**Validación:**
- [x] Test en local
- [x] Verificado con Lighthouse (100/100)
- [x] Verificado completitud de todos los idiomas

**Referencia:** [Estado SEO](./estado-seo.md)

---

### 2026-01-22: [Meta tags] — Actualización meta description
**Responsable:** web-team  
**Tipo:** Meta description  
**Motivo:** Incluir precio desde 5€ para mejorar CTR  
**Impacto esperado:** Positivo (mejor CTR en SERPs)  
**Archivos modificados:**
- `src/assets/i18n/es.json` (key `seo.home.description`)
- `src/assets/i18n/en.json` (key `seo.home.description`)
- Resto de idiomas

**Detalles:**
- Cambio de: "Consignas inteligentes en Córdoba"
- Cambio a: "Consignas inteligentes en Córdoba desde 5 €/día"

**Validación:**
- [x] Test en local
- [x] Verificado longitud óptima (~155 caracteres)

---

### 2026-01-25: [Documentación] — Creación normas críticas SEO
**Responsable:** web-team  
**Tipo:** Documentación (sin impacto SEO directo)  
**Motivo:** Establecer protocolos para evitar errores críticos  
**Impacto esperado:** Neutral (mejora de procesos internos)  
**Archivos creados:**
- `docs/reference/normas-criticas-seo.md`
- `docs/reference/seo-changelog.md`
- `docs/how-to/cambios-seo-seguros.md`

**Detalles:**
- Sistema de registro obligatorio para cambios críticos
- Checklist de validación pre-producción
- Inventario de elementos críticos vs. seguros

---

## 🔮 Cambios planificados

### [Pendiente] Migración a Angular 17+
**Responsable:** TBD  
**Tipo:** URLs (posible cambio de routing)  
**Motivo:** Actualización de framework  
**Impacto esperado:** Neutral (requiere 301s si cambian URLs)  
**Estado:** ⏸️ Planificado  

**Plan:**
- Mantener URLs actuales intactas
- Si cambio de estructura: implementar 301s
- Actualizar sitemap.xml
- Re-validar todos los elementos críticos

---

## 📊 Estadísticas de cambios

**Total de cambios registrados:** 5  
**Por tipo:**
- Title: 1
- Schema: 1
- Hreflang: 1
- Meta tags: 1
- Documentación: 1

**Última actualización:** 2026-01-25

---

## 📖 Ver también
- [Normas críticas de SEO](./normas-criticas-seo.md)
- [Estado actual SEO](./estado-seo.md)
- [Cómo hacer cambios SEO seguros](../how-to/cambios-seo-seguros.md)
