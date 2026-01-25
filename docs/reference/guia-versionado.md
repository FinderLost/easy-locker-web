---
title: Guía de Versionado
description: Sistema de versionado semántico del proyecto y procedimiento para actualizar versiones.
tags: [reference, versioning, semver, releases]
owner: web-team
last_updated: 2026-01-25
status: approved
llm_summary: Guía de versionado semántico (SemVer 2.0) con reglas, procedimiento de actualización y visualización en footer.
---

# Guía de Versionado

Este proyecto sigue **Semantic Versioning 2.0.0** (SemVer).

**Versión actual:** `1.2.0`

---

## 📖 Formato: MAJOR.MINOR.PATCH

### MAJOR (1.x.x)
Incrementar cuando se hacen cambios **incompatibles** en la API o funcionalidad.

**Ejemplos:**
- Migración de framework (ej. Angular 16 → 18)
- Cambio completo de diseño
- Eliminación de funcionalidades existentes
- Cambios que rompen integraciones

### MINOR (x.2.x)
Incrementar cuando se añaden **funcionalidades nuevas** de forma compatible.

**Ejemplos:**
- Nuevo idioma añadido
- Nueva sección en la web (ej. blog, área de usuario)
- Integración con nuevo servicio (ej. pagos, reservas)
- Features importantes pero compatibles

### PATCH (x.x.0)
Incrementar cuando se hacen **correcciones** de bugs compatibles.

**Ejemplos:**
- Fix de errores visuales
- Correcciones de traducciones
- Mejoras de performance
- Actualizaciones de seguridad menores
- Ajustes de SEO

---

## 📊 Historial de Versiones

### v1.2.0 (2026-01-25)
**Cambios:**
- ✅ Sistema de protección SEO completo
- ✅ Workflows CI/CD mejorados con validación automática
- ✅ Script de detección de cambios SEO
- ✅ Documentación optimizada para LLMs
- ✅ Sistema de versionado implementado

### v1.1.0 (2026-01-02) - Estimado
**Cambios:**
- Optimizaciones SEO (Schema.org, hreflang)
- Reviews de Google cacheadas multilenguaje
- Mejoras de i18n (7 idiomas)

### v1.0.0 (2025-11-15) - Estimado
**Cambios:**
- Primera versión en producción
- Diseño completo implementado
- Sistema de localización funcional
- Deploy automático a GitHub Pages

### v0.1.0 (2025-09-24)
**Cambios:**
- Migración inicial a Angular
- Configuración básica del proyecto

---

## 🔄 Cómo Actualizar la Versión

### 1. Decidir el tipo de cambio

**Pregúntate:**
- ¿Rompe algo existente? → MAJOR
- ¿Añade funcionalidad nueva? → MINOR  
- ¿Solo corrige bugs? → PATCH

### 2. Actualizar package.json

```bash
# Opción A: Manualmente
# Editar package.json y cambiar "version": "1.2.0"

# Opción B: Con npm (recomendado)
npm version patch   # 1.2.0 → 1.2.1
npm version minor   # 1.2.0 → 1.3.0
npm version major   # 1.2.0 → 2.0.0
```

**Nota:** `npm version` automáticamente:
- Actualiza package.json
- Crea un commit con mensaje "v1.3.0"
- Crea un tag git "v1.3.0"

### 3. Verificar la visualización

```bash
npm start
# Abrir http://localhost:4200
# Scroll al footer → Verificar versión mostrada
```

### 4. Commit y tag (si manual)

```bash
# Si editaste manualmente package.json
git add package.json
git commit -m "chore: bump version to 1.3.0"
git tag v1.3.0
```

### 5. Push con tags

```bash
git push origin develop
git push origin --tags
```

### 6. Crear release en GitHub (opcional)

1. Ir a: https://github.com/FinderLost/easy-locker-web/releases
2. Click "Create a new release"
3. Tag: `v1.3.0`
4. Title: `v1.3.0 - [Nombre descriptivo]`
5. Description:
   ```markdown
   ## Cambios
   - Feature X añadido
   - Fix de bug Y
   - Mejora de Z
   
   ## Notas
   - Requiere X
   - Depreca Y (si aplica)
   ```

---

## 🎯 Visualización en el Footer

La versión se muestra automáticamente en el footer de la web:

**Ubicación:**
- Componente: `src/app/components/footer/footer.component.ts`
- Template: `src/app/components/footer/footer.component.html`

**Implementación:**
```typescript
import { version } from '../../../../package.json';

export class FooterComponent {
  appVersion = version;
  // ...
}
```

**HTML:**
```html
<div class="inline-flex items-center gap-1.5 text-xs text-brand-textMuted">
  <span>v{{ appVersion }}</span>
</div>
```

**Estilo:**
- Texto pequeño (`text-xs`)
- Color tenue (`text-brand-textMuted`)
- Junto a "Made with ❤️ in Córdoba"
- Separado por divisor vertical

---

## 📝 Buenas Prácticas

### ✅ Hacer
- Usar `npm version` para evitar errores
- Crear tag git por cada versión
- Documentar cambios importantes en releases de GitHub
- Incrementar versión ANTES de merge a main
- Seguir SemVer estrictamente

### ❌ Evitar
- Saltar versiones (ej. 1.2.0 → 1.4.0)
- Reutilizar números de versión
- Cambiar versión en múltiples commits
- Olvidar actualizar CHANGELOG (si existe)
- Hacer releases sin testing

---

## 🔗 Integración con CI/CD

### Workflow recomendado

1. **Feature development en `develop`:**
   - NO incrementar versión aún
   - Desarrollar normalmente

2. **Antes de crear release PR:**
   ```bash
   git checkout develop
   npm version minor  # O patch/major según corresponda
   git push origin develop --tags
   ```

3. **Crear release PR (`develop` → `main`):**
   - Ya incluye la nueva versión
   - CI/CD ejecuta tests

4. **Merge a `main`:**
   - Deploy automático con nueva versión
   - Tag ya existe en develop

5. **(Opcional) Crear GitHub Release:**
   - Usar el tag creado
   - Añadir changelog

---

## 🔍 Verificar Versión Actual

### En código
```bash
cat package.json | grep version
# "version": "1.2.0"
```

### En la web (producción)
```bash
open https://finderloost.github.io/easy-locker-web/
# Scroll al footer → Ver "v1.2.0"
```

### En consola del navegador
```javascript
// Opción futura: exponer en window
console.log('Version:', window.EASY_LOCKER_VERSION);
```

---

## 📦 Pre-release y Build Numbers

### Pre-release (opcional)
Para versiones alpha/beta/rc:

```bash
npm version 1.3.0-alpha.1
npm version 1.3.0-beta.1
npm version 1.3.0-rc.1
```

**Visualización:** `v1.3.0-beta.1`

### Build metadata (opcional)
Para builds específicos:

```bash
# Versión: 1.3.0+20260125
# No afecta precedencia en SemVer
```

---

## 🎓 Referencias

- [Semantic Versioning 2.0.0](https://semver.org/)
- [npm version docs](https://docs.npmjs.com/cli/v9/commands/npm-version)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Responsable:** web-team  
**Última actualización:** 2026-01-25  
**Próxima revisión:** Cuando se haga upgrade a Angular 18 (v2.0.0)
