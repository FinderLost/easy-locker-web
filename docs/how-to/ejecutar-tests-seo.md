---
title: Ejecutar tests SEO automatizados
category: how-to
tags: [testing, seo, playwright, e2e]
date: 2026-01-23
---

# Ejecutar tests SEO automatizados

## Objetivo

Validar de forma automática todas las implementaciones SEO (meta tags, JSON-LD, hreflang, etc.) sin intervención manual.

## Requisitos previos

- Servidor de desarrollo corriendo (`npm start`)
- Playwright instalado (`npx playwright install chromium`)

## Ejecución básica

```bash
# Ejecutar todos los tests SEO
npx playwright test e2e/seo-validation.spec.ts

# Con reporte detallado
npx playwright test e2e/seo-validation.spec.ts --reporter=list

# Ver solo resumen
npx playwright test e2e/seo-validation.spec.ts --reporter=list 2>&1 | tail -80
```

## Qué validan los tests

### SEO Complete Validation (15 tests)

1. **Meta tags básicos**: Title, description, keywords, robots
2. **Open Graph**: 6 propiedades (title, description, image, url, type, site_name)
3. **Twitter Card**: 4 propiedades (card, title, description, image)
4. **Geo-targeting**: Coordenadas GPS exactas (37.8898628, -4.7890138)
5. **Canonical URL**: Presente y correcto
6. **Hreflang**: 8 tags (7 idiomas + x-default)
7. **HTML lang**: Dinámico según idioma seleccionado
8. **JSON-LD Schema.org**: LocalBusiness completo con 15+ propiedades
9. **Preconnect/DNS prefetch**: Configurados para performance
10. **Jerarquía H1/H2**: Correcta y semántica
11. **Alt text**: Todas las imágenes tienen descripción
12. **Lazy loading**: Imágenes optimizadas
13. **Selector idioma**: Funcional y actualiza meta tags
14. **Favicons**: Light y dark mode
15. **Performance**: Recursos críticos optimizados

### Multi-idioma (7 tests)

Valida que en todos los idiomas (es, en, fr, de, it, pt, ko):
- Atributo `lang` correcto
- Title y description presentes
- JSON-LD Business info constante

### Accessibility (1 test)

- ARIA labels en botones y elementos interactivos

## Interpretación de resultados

```bash
✓  23 passed (17.4s)  # ✅ Todo correcto
❌ 2 failed           # ⚠️ Revisar errores
```

**Ejemplo de error común:**

```
Error: expect(received).toContain(expected)
Expected substring: "Easy Locker"
Received string:    ""
```

**Solución:** El meta tag no se está generando. Verificar [src/app/app.component.ts](../reference/i18n-estado-actual.md).

## Ejecutar tests específicos

```bash
# Solo tests multi-idioma
npx playwright test e2e/seo-validation.spec.ts -g "Multi-idioma"

# Solo JSON-LD
npx playwright test e2e/seo-validation.spec.ts -g "JSON-LD"

# Solo un idioma
npx playwright test e2e/seo-validation.spec.ts -g "Español"
```

## Debugging

```bash
# Modo debug con UI
npx playwright test e2e/seo-validation.spec.ts --debug

# Ver screenshots de fallos
ls test-results/seo-validation-*/test-failed-*.png

# Ver videos de ejecución
ls test-results/seo-validation-*/video.webm
```

## Integración continua

Los tests deben ejecutarse:
- Antes de cada deploy
- Después de cambios en i18n
- Después de modificar meta tags o JSON-LD

Ver [desplegar.md](./desplegar.md) para flujo completo.

## Troubleshooting

### Error: "Timeout 90000ms exceeded"

El servidor no responde. Verificar:
```bash
# ¿Está corriendo en :4200?
curl http://localhost:4200
```

### Error: "Browser not found"

Instalar navegadores:
```bash
npx playwright install chromium
```

### Tests pasan local pero fallan en CI

Agregar timeout mayor en playwright.config.ts:
```ts
timeout: 90000, // 90 segundos
```

## Ver también

- [tests-ui.md](./tests-ui.md) - Otros tests UI
- [estado-seo.md](../reference/estado-seo.md) - Inventario SEO completo
- [plan-accion-seo-2026-01.md](../reference/plan-accion-seo-2026-01.md) - Plan de acción

