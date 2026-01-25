# 🤖 Changelog del Agente - Easy Locker Web

> **Propósito**: Memoria persistente y recurrente del agente para mantener contexto entre conversaciones.  
> **Actualización**: Este archivo DEBE actualizarse después de cada sesión significativa.  
> **Formato**: Cronológico inverso (más reciente primero).

---

## 📋 Índice

- [Cómo usar esta memoria](#cómo-usar-esta-memoria)
- [Estado actual del proyecto](#estado-actual-del-proyecto)
- [Historial de sesiones](#historial-de-sesiones)
- [Decisiones arquitectónicas clave](#decisiones-arquitectónicas-clave)
- [Conocimientos críticos del proyecto](#conocimientos-críticos-del-proyecto)

---

## 🧠 Cómo usar esta memoria

### Para el agente (lectura obligatoria al inicio de cada sesión)
1. **SIEMPRE leer** secciones "Estado actual" y últimas 3 sesiones del historial
2. **Verificar** si hay decisiones arquitectónicas relacionadas con la tarea actual
3. **Consultar** conocimientos críticos antes de modificar áreas sensibles (SEO, i18n, routing)
4. **Actualizar** este archivo al final de cada sesión con cambios relevantes

### Para el desarrollador humano
- Úsalo para revisar qué ha hecho el agente entre sesiones
- Documenta aquí decisiones importantes que el agente debe recordar
- Marca con 🚨 información crítica que NUNCA debe olvidarse

---

## 🎯 Estado actual del proyecto

**Última actualización**: 2026-01-25  
**Versión actual**: `v1.2.0`  
**Branch activo**: `fix/security-vulnerabilities`  
**Ramas**: `main` (prod), `develop` (pre-prod), `fix/security-vulnerabilities` (work)

### 🟢 Sistemas activos
- ✅ **Protección SEO**: Script `seo:check` + CI/CD validation en PRs
- ✅ **Versionado semántico**: `package.json` → Footer display (v{{ appVersion }})
- ✅ **Workflow CI/CD**: 4 workflows (ci-tests, deploy, create-release-pr, update-reviews)
- ✅ **Compilación**: Proyecto compila correctamente (build exitoso)

### 🔴 Problemas conocidos
- ⚠️ **34 vulnerabilidades** de seguridad (2 críticas, 24 altas) → Requiere upgrade a Angular 18
- ⚠️ **Budget warning**: Bundle inicial 679 KB excede límite 500 KB (no crítico)
- ⚠️ **Node v19.8.1**: Versión non-LTS (considerar actualizar a LTS)

### 📦 Pendientes inmediatos
1. Merge de branch `fix/security-vulnerabilities` a `develop`
2. Crear Release PR de `develop` a `main` para deploy v1.2.0
3. Planificar upgrade Angular 16 → 18 (ver `docs/reference/security-vulnerabilities-2026-01.md`)

---

## 📅 Historial de sesiones

### Sesión 2026-01-25: Versionado + Verificación de compilación

**Contexto**: Usuario solicitó implementar versionado semántico y capacidad de verificar compilación antes de entregar trabajos.

**Cambios realizados**:
- 🐛 **Corregido error compilación**: Import de `package.json` cambiado de named export a default import
  - Antes: `import { version } from '../../../../package.json'`
  - Después: `import packageJson from '../../../../package.json'`
  - Añadido `allowSyntheticDefaultImports: true` en `tsconfig.json`
- ✅ **Verificado build**: `npm run build` exitoso (679 KB, warning budget no crítico)
- 📝 **Creado sistema memoria**: Este archivo (`CHANGELOG-AGENT.md`) para mantener contexto entre sesiones

**Archivos modificados**:
- `src/app/components/footer/footer.component.ts` (línea 11, 23)
- `tsconfig.json` (línea 22)
- `docs/meta/CHANGELOG-AGENT.md` (nuevo)
- `docs/how-to/verificacion-pre-entrega.md` (nuevo)
- `.github/agents/Easy Locker - Agent.agent.md` (actualizado)

**Comandos clave ejecutados**:
```bash
npm run build  # Verificación compilación (exitoso)
```

**Decisiones técnicas**:
- Usar **default import** para JSON en TypeScript (compatible con Angular build)
- Versión `v1.2.0` basada en análisis de 173 commits (Sept 2025 - Ene 2026)

**Estado al cierre**: 
- ✅ Web compila correctamente
- ✅ Versión se muestra en footer (probado en build)
- ⏳ Pendiente merge a develop

---

### Sesión 2026-01-25: Implementación protección SEO + Workflow review

**Contexto**: Usuario solicitó revisar workflows y garantizar protección de elementos críticos SEO.

**Cambios realizados**:
- 🔒 **Sistema protección SEO completo**:
  - Script `scripts/detect-seo-changes.js` (detección automática cambios críticos)
  - CI/CD job `seo-validation` en PRs (develop/main/release/**)
  - 6 documentos nuevos: normas críticas, changelog, guía cambios seguros
  - Scripts npm: `seo:check` (dev) y `seo:check:strict` (CI)

- 🔄 **Workflows optimizados**:
  - `ci-tests.yml`: Renombrado, añadido SEO + build + lint + artifacts
  - `deploy.yml`: Revisado, funcionando correctamente
  - `create-release-pr.yml`: Validado, triggers correctos
  - `update-reviews.yml`: Validado, manual dispatch

**Documentación creada**:
- `docs/reference/normas-criticas-seo.md` (elementos críticos vs seguros)
- `docs/reference/seo-changelog.md` (registro histórico cambios)
- `docs/how-to/cambios-seo-seguros.md` (guía procedimientos)
- `docs/how-to/push-hotfix-seo.md` (emergencias)
- `docs/how-to/desplegar.md` (actualizado con validación SEO)
- `README.md` (actualizado con warnings SEO)

**Commits**:
- `7db8fc3`: "feat: sistema protección SEO completo + review workflows" (2,087 líneas, 18 archivos)

**Estado al cierre**: 
- ✅ Sistema SEO activo y validado
- ✅ Workflows funcionando correctamente
- ✅ Documentación completa

---

### Sesión 2026-01-25: Análisis vulnerabilidades seguridad

**Contexto**: 34 vulnerabilidades detectadas por `npm audit`.

**Cambios realizados**:
- 📊 **Análisis completo vulnerabilidades**:
  - Documento `docs/reference/security-vulnerabilities-2026-01.md` (detalle CVEs)
  - 2 críticas (Angular XSS), 24 altas (webpack, esbuild), 5 moderadas, 3 bajas
  - Impacto mayormente en dev (no afecta producción directamente)
  - Recomendación: Upgrade Angular 16 → 18

**Commits**:
- `e73a5db`: "docs: análisis completo vulnerabilidades seguridad npm audit"

**Decisiones técnicas**:
- No aplicar fix parcial (conflicto peer dependencies angular-cli-ghpages)
- Planificar upgrade mayor Angular 18 para resolver raíz del problema

**Estado al cierre**: 
- ✅ Vulnerabilidades documentadas
- ⏳ Upgrade pendiente (requiere planificación)

---

### Sesión 2026-01-25: Inicio proyecto + Servidor dev

**Contexto**: Primera interacción de la sesión.

**Comandos ejecutados**:
```bash
npm start  # Servidor dev iniciado en localhost:4200
```

**Estado al cierre**: 
- ✅ Servidor dev corriendo correctamente

---

## 🏛️ Decisiones arquitectónicas clave

### 1. 🔒 Protección SEO mediante CI/CD
**Fecha**: 2026-01-25  
**Decisión**: Implementar validación automática de cambios SEO críticos en PRs  
**Razón**: Prevenir cambios accidentales en URLs, robots.txt, canonical, hreflang, H1, titles  
**Implementación**: Script Node.js (`detect-seo-changes.js`) + job CI/CD + changelog obligatorio  
**Impacto**: Todo PR con cambios SEO críticos requiere aprobación explícita y registro en changelog  

### 2. 📦 Versionado semántico visible
**Fecha**: 2026-01-25  
**Decisión**: Mostrar versión actual en footer siguiendo SemVer 2.0  
**Razón**: Trazabilidad de releases y transparencia para equipo/usuarios  
**Implementación**: `package.json` version → footer component (default import JSON)  
**Versión inicial**: `v1.2.0` (basada en 173 commits históricos)  

### 3. 🧪 Verificación pre-entrega obligatoria
**Fecha**: 2026-01-25  
**Decisión**: Agente debe ejecutar `npm run build` antes de finalizar trabajos  
**Razón**: Detectar errores de compilación antes de entregar al usuario  
**Implementación**: Procedimiento documentado en `docs/how-to/verificacion-pre-entrega.md`  
**Comandos**: `npm run build` (producción) + `npm run test` (opcional según contexto)  

### 4. 🧠 Sistema de memoria persistente
**Fecha**: 2026-01-25  
**Decisión**: Mantener `CHANGELOG-AGENT.md` como memoria entre sesiones  
**Razón**: Evitar pérdida de contexto entre conversaciones del agente  
**Implementación**: Archivo en `docs/meta/` actualizado al final de cada sesión significativa  
**Uso**: Lectura obligatoria al inicio de cada nueva sesión  

---

## 🔐 Conocimientos críticos del proyecto

### 🚨 NO TOCAR sin consultar documentación

#### URLs y routing
- Archivo: `src/app/app-routing.module.ts`
- Rutas i18n: `/:lang/home`, `/:lang/cookie-policy`
- Redirect: `/` → `/:lang/home` (detecta idioma)
- **Documentación**: `docs/reference/normas-criticas-seo.md`
- **Procedimiento**: Actualizar `seo-changelog.md` ANTES de cambiar

#### Robots.txt
- Archivo: `src/robots.txt`
- Permite todo: `User-agent: *` + `Allow: /`
- Sitemap: `https://easylocker.net/sitemap.xml`
- **⚠️ NUNCA cambiar sin aprobación**: Impacto directo en indexación Google

#### Internacionalización (i18n)
- Archivos: `src/assets/i18n/*.json` (7 idiomas: es, en, de, fr, it, ko, pt)
- Claves críticas: `hero.*`, `lockerSizes.*`, `faq_qN/faq_aN`, `pricing.*`
- Servicio: `LanguageService` (detección automática + manual switching)
- **Documentación**: `docs/reference/i18n-estado-actual.md`, `docs/how-to/dar-alta-idioma.md`

#### Canonical y hreflang
- Componente: `HomeComponent` (genera dinámicamente)
- Base URL: `https://easylocker.net`
- Alternates: 7 idiomas + `x-default`
- **⚠️ Cambios requieren validación Screaming Frog**: Ver `docs/how-to/analisis-seo-screaming-frog.md`

#### Google Reviews
- Config: `src/assets/config/reviews-config.js` (placeId, API key placeholder)
- Data: `src/assets/data/google-reviews.json` (actualizado manualmente)
- Workflow: `update-reviews.yml` (manual dispatch)
- **Procedimiento**: `docs/how-to/actualizar-reviews.md`

### 🔧 Configuraciones técnicas importantes

#### Compilación TypeScript
- Archivo: `tsconfig.json`
- Opciones clave: `resolveJsonModule: true`, `allowSyntheticDefaultImports: true`
- Target: `ES2022`, Angular strict mode habilitado

#### Scripts npm clave
```json
{
  "start": "ng serve",
  "build": "ng build",
  "test": "ng test",
  "seo:check": "node scripts/detect-seo-changes.js",
  "seo:check:strict": "node scripts/detect-seo-changes.js --strict"
}
```

#### Workflows GitHub Actions
1. **ci-tests.yml**: PRs a develop/main/release/** (SEO + build + lint + test)
2. **deploy.yml**: Push a main → GitHub Pages
3. **create-release-pr.yml**: Manual dispatch → PR release/** → main
4. **update-reviews.yml**: Manual dispatch → actualiza reviews JSON

### 📚 Documentación estructura
- **Patrón**: Diataxis light (how-to, reference, meta)
- **Índice**: `docs/README.md`
- **Meta**: Patrones y memoria del agente
- **How-to**: Procedimientos paso a paso
- **Reference**: Estado actual y decisiones

---

## 🔄 Matriz de recurrencia (auto-mantenimiento)

### Cada inicio de sesión
- [ ] Leer sección "Estado actual del proyecto"
- [ ] Revisar últimas 3 entradas del historial
- [ ] Verificar si hay decisiones arquitectónicas relacionadas con la tarea

### Durante el trabajo
- [ ] Consultar "Conocimientos críticos" antes de tocar áreas sensibles
- [ ] Documentar decisiones importantes en tiempo real
- [ ] Ejecutar `npm run build` antes de entregar cambios

### Al finalizar sesión
- [ ] Actualizar sección "Estado actual del proyecto"
- [ ] Añadir entrada en "Historial de sesiones" (si cambios significativos)
- [ ] Documentar nuevas decisiones arquitectónicas (si aplica)
- [ ] Actualizar "Conocimientos críticos" (si se descubrió algo nuevo)
- [ ] Commit del CHANGELOG-AGENT.md actualizado

---

## 📊 Métricas del proyecto

**Repositorio**: FinderLost/easy-locker-web  
**Inicio**: 2025-09-24 (primer commit: "Migrate to Angular project")  
**Commits totales**: 173 (a 2026-01-25)  
**Tiempo desarrollo**: ~4 meses  
**Idiomas**: 7 (es, en, de, fr, it, ko, pt)  
**Bundle size**: 679 KB (excede budget 500 KB - warning no crítico)  
**Tests**: Karma + Playwright (E2E SEO)

---

## 🎓 Lecciones aprendidas

### TypeScript + JSON imports
- **Problema**: Named exports de JSON no funcionan en producción Angular
- **Solución**: Usar default import (`import packageJson from './file.json'`)
- **Config requerida**: `resolveJsonModule: true` + `allowSyntheticDefaultImports: true`

### Vulnerabilidades npm
- **Problema**: 34 vulnerabilidades (mayormente dev dependencies)
- **Solución parcial**: No existe sin upgrade mayor Angular
- **Aprendizaje**: Peer dependencies bloquean fixes parciales

### SEO en SPA
- **Problema**: Cambios accidentales en routing/meta afectan indexación
- **Solución**: Protección mediante CI/CD + changelog obligatorio
- **Herramienta**: Screaming Frog para validación pre-deploy

---

**Fin del changelog - Última actualización: 2026-01-25 18:35 UTC**
