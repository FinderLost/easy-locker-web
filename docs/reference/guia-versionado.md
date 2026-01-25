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

### Sistema Automático (Recomendado) 🤖

**Desde 2026-01-25**: El proyecto cuenta con un workflow de GitHub Actions que incrementa automáticamente la versión al hacer merge de PRs.

**Funcionamiento:**
1. **Crear PR** a `develop` o `main`
2. **Mergear PR** normalmente
3. **Automático**: El workflow `auto-version-bump.yml` se activa
4. **Analiza commits** del PR usando Conventional Commits
5. **Incrementa versión** según el tipo:
   - `feat:` → MINOR (x.Y.x)
   - `fix:` → PATCH (x.x.Y)
   - `BREAKING CHANGE:` → MAJOR (X.x.x)
   - En `develop` siempre → PATCH
6. **Commit automático**: `chore: bump version to X.Y.Z [skip ci]`
7. **Tag Git** (solo en main): `vX.Y.Z`
8. **Comentario en PR** con detalles del bump

**Convención de commits:**
```bash
# PATCH (bug fixes)
git commit -m "fix: corregir error en footer"
git commit -m "docs: actualizar README"

# MINOR (nuevas features)
git commit -m "feat: añadir soporte para italiano"
git commit -m "feat(seo): optimizar title tags"

# MAJOR (breaking changes)
git commit -m "feat!: migrar a Angular 18"
git commit -m "feat: cambiar routing BREAKING CHANGE: URLs modificadas"
```

**Ventajas:**
- ✅ Versión siempre actualizada tras cada merge
- ✅ Historial claro en Git tags
- ✅ No requiere intervención manual
- ✅ Visible inmediatamente en footer de la web

---

### Sistema Manual (Fallback)

Si el workflow automático falla o necesitas control total:

#### 1. Decidir el tipo de cambio

**Pregúntate:**
- ¿Rompe algo existente? → MAJOR
- ¿Añade funcionalidad nueva? → MINOR  
- ¿Solo corrige bugs? → PATCH

#### 2. Actualizar package.json

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

### Workflow automático (Actual)

El workflow `auto-version-bump.yml` gestiona todo automáticamente:

**Proceso completo:**
1. **Development** en rama feature (ej. `feat/nueva-funcionalidad`)
2. **Crear PR** a `develop`
3. **Mergear PR** → Workflow se activa automáticamente
4. **Auto-bump**: Versión incrementada (ej. 1.2.0 → 1.2.1)
5. **Commit**: `chore: bump version to 1.2.1 [skip ci]`
6. **Visible**: Footer actualizado en próximo deploy

**Para releases a producción:**
1. **Crear PR** de `develop` → `main` (usar workflow `create-release-pr`)
2. **Mergear** → Auto-bump + Git tag creado (ej. `v1.2.1`)
3. **Deploy automático** a GitHub Pages con nueva versión

**Ventaja clave:** No necesitas recordar actualizar la versión, se hace automáticamente tras cada merge.

---

### Workflow manual (Legacy / Fallback)

Si el workflow automático está deshabilitado o falla:

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

### Últimos tags Git
```bash
git tag -l | tail -5
# v1.2.0
# v1.2.1
# ...
```

---

## 🐛 Troubleshooting

### Problema: Versión no actualizada tras merge

**Síntoma**: Mergeaste a develop/main pero la versión sigue igual.

**Diagnóstico:**
```bash
# Verificar si el workflow se ejecutó
gh run list --workflow=auto-version-bump.yml --limit=5

# Ver logs del último run
gh run view --log
```

**Soluciones:**
1. Verificar que usas **Conventional Commits** (`feat:`, `fix:`, etc.)
2. Comprobar que el PR fue **mergeado** (no cerrado sin merge)
3. Revisar permisos del workflow en `.github/workflows/auto-version-bump.yml`
4. Ejecutar bump manual si es urgente: `npm version patch && git push --tags`

### Problema: Conflicto al hacer bump automático

**Síntoma**: Workflow falla con error de conflicto en package.json.

**Causa**: Dos PRs mergeados casi simultáneamente.

**Solución:**
```bash
git checkout develop
git pull origin develop
npm version patch  # Incrementar manualmente
git push origin develop --tags
```

### Problema: Footer no muestra nueva versión

**Síntoma**: Versión actualizada en package.json pero footer muestra versión antigua.

**Diagnóstico:**
```bash
# Verificar compilación incluye nuevo package.json
npm run build
grep -r "1.2.0" dist/easy-locker-angular/
```

**Soluciones:**
1. Limpiar cache: `rm -rf dist/ node_modules/.cache/`
2. Rebuild: `npm run build`
3. Hard refresh en navegador: Ctrl+Shift+R (o Cmd+Shift+R en Mac)
4. Verificar que `tsconfig.json` tiene `resolveJsonModule: true`

---

## 📚 Referencias

- **Semantic Versioning**: https://semver.org/
- **Conventional Commits**: https://www.conventionalcommits.org/
- **npm version**: https://docs.npmjs.com/cli/v10/commands/npm-version
- **GitHub Actions**: https://docs.github.com/en/actions

**Documentos relacionados:**
- [Workflows CI/CD](workflows-cicd.md)
- [Sistema de memoria del agente](../meta/CHANGELOG-AGENT.md)
- [Verificación pre-entrega](../how-to/verificacion-pre-entrega.md)

---

**Última actualización**: 2026-01-25  
**Estado**: Workflow automático activo desde v1.2.0

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
