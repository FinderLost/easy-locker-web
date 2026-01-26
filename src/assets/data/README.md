# Business Information - Single Source of Truth

## 📋 Propósito

Este archivo **`business-info.json`** es la **fuente única de verdad** para toda la información del negocio Easy Locker utilizada en:

- ✅ Schema.org JSON-LD (`src/index.html`)
- ✅ Tests E2E de validación (`e2e/seo-validation.spec.ts`)
- ✅ Futura integración con Google Business Profile API
- ✅ Documentación y referencias

## ⚠️ Reglas Críticas

### 1. **NO modificar valores duplicados**
Si necesitas cambiar información del negocio (dirección, teléfono, horarios, precios):
- ✅ **Editar SOLO** `business-info.json`
- ❌ **NO editar** valores directamente en `index.html` o tests
- ✅ **Sincronizar** después manualmente (hasta automatización futura)

### 2. **Valores deben coincidir 100% con Google Business**
Todos los datos en este archivo deben ser **exactamente iguales** a los registrados en Google Business Profile:
- Dirección completa (incluyendo "Local 11")
- Teléfono con formato internacional
- Coordenadas GPS
- Horarios
- Redes sociales (URLs exactas)

### 3. **Formato estricto**
- Precios: números decimales (ej: `5.00`, no `"5"`)
- Coordenadas: strings (ej: `"37.8898628"`)
- URLs: completas con `https://`
- Horarios: formato `HH:MM` 24h

## 📝 Campos Principales

### `business`
Información general del negocio (nombre, URL, contacto, precios)

### `address`
Dirección postal completa

### `geo`
Coordenadas GPS exactas

### `openingHours`
Horarios en múltiples formatos:
- `specification`: Para Schema.org OpeningHoursSpecification
- `shortFormat`: Para displays compactos (Mo-Su 00:00-23:59)
- `display`: Para UI amigable (24/7)

### `socialMedia`
URLs exactas de perfiles sociales (Facebook, Instagram, TikTok)

### `services`
Catálogo de servicios (M, L, XL) con:
- Dimensiones exactas
- Descripciones
- Precios actualizados

### `images`
URLs de logos y social cards

## 🔄 Sincronización Manual (Temporal)

**Después de editar `business-info.json`:**

1. **Actualizar `src/index.html`** (Schema.org JSON-LD):
   - LocalBusiness: name, telephone, priceRange, address, geo, openingHoursSpecification, sameAs
   - Organization: name, legalName, address, contactPoint.telephone, sameAs

2. **Verificar tests**: 
   ```bash
   npx playwright test e2e/seo-validation.spec.ts
   ```

3. **Verificar build**:
   ```bash
   npm run build
   ```

## 🚀 Automatización Futura

**Próxima fase**: Implementar script que:
1. Lee `business-info.json`
2. Genera automáticamente Schema.org JSON-LD
3. Actualiza tests con valores correctos
4. Valida consistencia en todo el proyecto

## 📊 Ejemplo de Uso en Tests

```typescript
// e2e/seo-validation.spec.ts
const businessInfo = require('../src/assets/data/business-info.json');

// Validar dirección
expect(localBusiness.address.streetAddress).toBe(businessInfo.address.streetAddress);

// Validar teléfono
expect(localBusiness.telephone).toBe(businessInfo.business.telephone);

// Validar precios
expect(offerM.price).toBe(businessInfo.services.M.price.toFixed(2));
```

## 🔗 Referencias

- **Google Business Profile**: https://business.google.com
- **Schema.org LocalBusiness**: https://schema.org/LocalBusiness
- **Schema.org Organization**: https://schema.org/Organization

---

**Última actualización**: 2026-01-26  
**Versión**: 1.0.0  
**Responsable**: Easy Locker Web Team
