---
title: Meta Description Compliance
description: Estado actual de compliance de meta descriptions con estándar SEOptimer 120-160 caracteres.
tags: [reference, seo, meta-description, audit, compliance]
owner: web-team
last_updated: 2026-01-26
status: approved
llm_summary: Tabla de compliance de meta descriptions en 7 idiomas tras ajuste SEO 2026-01-26.
---

# Meta Description Compliance

Estado actual tras optimización SEO (2026-01-26).

## 📊 Resumen

| Idioma | Código | Longitud | Estado | Cambio realizado |
|--------|--------|----------|--------|------------------|
| Español | es | 155 chars | ✅ | 140→155 (añade "cámaras de vigilancia") |
| English | en | 151 chars | ✅ | 161→151 (cambia "convenient"→"ideal") |
| Italiano | it | 139 chars | ✅ | 115→139 (añade "telecamere di sicurezza") |
| Deutsch | de | 157 chars | ✅ | 119→157 (añade "Überwachungskameras") |
| Français | fr | 139 chars | ✅ | 117→139 (añade "caméras de surveillance") |
| 한국어 | ko | 125 chars | ✅ | 61→125 (descripción completa) |
| Português | pt | 143 chars | ✅ | Ya compliant (sin cambios) |
| **HTML Base** | — | **134 chars** | ✅ | **47→134** (crítico para SEO tools) |

## 🎯 Estándar aplicado

**SEOptimer 2018**: Meta descriptions óptimas entre **120-160 caracteres**.

- Google ajustó límite de 320 chars (2017) a ~155-160 chars (2018)
- Longitud dinámica según dispositivo/query
- Rango 120-160 asegura consistencia cross-device
- No es factor directo de ranking, pero impacta CTR (indirecto SEO)

## 🔍 Elementos validados

### 1. Meta básica (`<meta name="description">`)
- HTML base: `src/index.html` (line 19)
- i18n dinámico: `src/assets/i18n/*.json` (seo.home.description)
- Validación E2E: `≥120 & ≤160` caracteres

### 2. Open Graph (`og:description`)
- Mismo contenido que meta básica
- Validación E2E: `≥120 & ≤160` caracteres

### 3. Twitter Card (`twitter:description`)
- Mismo contenido que meta básica
- Validación E2E: `≥120 & ≤160` caracteres

## ✅ Tests E2E

Ubicación: [e2e/seo-validation.spec.ts](../../e2e/seo-validation.spec.ts)

```typescript
// Validación estricta en 3 ubicaciones:
expect(metaDescription?.length).toBeGreaterThanOrEqual(120);
expect(metaDescription?.length).toBeLessThanOrEqual(160);

expect(ogDescription?.length).toBeGreaterThanOrEqual(120);
expect(ogDescription?.length).toBeLessThanOrEqual(160);

expect(twitterDescription?.length).toBeGreaterThanOrEqual(120);
expect(twitterDescription?.length).toBeLessThanOrEqual(160);
```

**Resultado actual**: 23/23 tests passing

## 📝 Contenido añadido

Características de seguridad y ubicación enfatizadas:

- **ES**: "cámaras de vigilancia"
- **EN**: "security cameras, and ideal location"
- **IT**: "telecamere di sicurezza e posizione comoda"
- **DE**: "Überwachungskameras und idealer Lage"
- **FR**: "caméras de surveillance et emplacement idéal"
- **KO**: Descripción completa con "보안 카메라" y beneficios de ubicación
- **PT**: Ya compliant (sin cambios)

## 🚨 Lección crítica

**HTML base > Dynamic Angular updates** para SEO tools:

- SEOptimer, Screaming Frog, y otros crawlers escanean el HTML inicial (`src/index.html`)
- Angular actualiza meta tags dinámicamente **después** del bootstrap
- Si HTML base tiene descripción corta (ej. 47 chars), SEO tools reportan fallo
- **Solución**: Asegurar que HTML base cumple estándar + i18n también

## 🔗 Referencias

- [SEOptimer Article](https://www.seoptimer.com/blog/meta-description-length/) - "Keep Meta Descriptions Up to 155 Characters" (actualizado 2018)
- [SEO Changelog](./seo-changelog.md) - Entrada 2026-01-26
- [Verificación Pre-Entrega](../how-to/verificacion-pre-entrega.md) - Proceso obligatorio
- [Tests E2E SEO](../../e2e/seo-validation.spec.ts) - Validación automatizada

## 📅 Próximos pasos

- [ ] Verificar en SEOptimer tras despliegue
- [ ] Ejecutar Screaming Frog en staging
- [ ] Monitorear CTR en Google Search Console (2-4 semanas post-deploy)
- [ ] Considerar A/B testing de contenido description si CTR no mejora

---

**Última actualización**: 2026-01-26  
**PR asociado**: feat/seo-meta-descriptions-120-160  
**Commit**: e0cce42
