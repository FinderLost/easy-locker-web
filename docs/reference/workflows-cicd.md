---
title: Workflows de CI/CD
description: Referencia completa de workflows automáticos de GitHub Actions del proyecto.
tags: [reference, ci-cd, workflows, github-actions, automation]
owner: web-team
last_updated: 2026-01-25
status: approved
llm_summary: Catálogo de workflows automáticos: CI tests, deploy, release PR, reviews cache y validación SEO.
---

# Workflows de CI/CD

Este documento describe todos los workflows automáticos de GitHub Actions del proyecto.

## 📋 Resumen de workflows

| Workflow | Trigger | Propósito | Estado |
|----------|---------|-----------|--------|
| [CI Tests & Quality](#ci-tests--quality-checks) | PR a `main`, `develop`, `release/**` | Tests, validación SEO, build check | ✅ Activo |
| [Deploy to GitHub Pages](#deploy-to-github-pages) | Push a `main` | Despliegue a producción | ✅ Activo |
| [Create Release PR](#create-release-pr) | Manual | Crear PR `develop` → `main` | ✅ Activo |
| [Update Reviews Cache](#update-google-reviews-cache) | Lunes 03:00 UTC + Manual | Refrescar reviews de Google | ✅ Activo |

---

## 🧪 CI Tests & Quality Checks

**Archivo:** `.github/workflows/ci-tests.yml`

### Trigger
```yaml
on:
  pull_request:
    branches: [main, develop, release/**]
```

### Jobs

#### 1. SEO Validation
**Propósito:** Detectar cambios críticos de SEO

**Pasos:**
1. Checkout con historial completo (`fetch-depth: 0`)
2. Setup Node.js 20
3. Instalar dependencias (`npm ci`)
4. Ejecutar `npm run seo:check`
5. Si detecta cambios críticos → comentar en el PR

**Archivos monitoreados:**
- `src/app/app-routing.module.ts` (URLs)
- `src/robots.txt`
- `src/app/app.component.ts` (meta tags, canonical, hreflang)
- `src/assets/i18n/*.json` (títulos, contenido)
- `src/sitemap.xml`

**Permisos:** `contents: read`, `pull-requests: write`

#### 2. Quality (Code Quality & Build)
**Propósito:** Validar código, build y tests

**Pasos:**
1. Checkout
2. Setup Node.js 20
3. Generar `firebase.config.ts` (placeholder)
4. Instalar dependencias (`npm ci`)
5. **Lint** (si está disponible) - continúa si falla
6. **Build check** (`npm run build`) - verifica que compila
7. Instalar Playwright Chromium
8. **Unit tests** (Karma + ChromeHeadless)
9. **E2E tests** (Playwright, 1 worker)
10. Subir resultados si fallan (artifact `test-results`, 7 días)

**Permisos:** `contents: read`

### Cuándo se ejecuta
- ✅ Toda PR a `develop` (features, fixes)
- ✅ Toda PR a `main` (releases)
- ✅ Toda PR a ramas `release/**` (hotfixes)

### Qué valida
- ✅ Cambios críticos de SEO documentados
- ✅ Código compila correctamente
- ✅ Tests unitarios pasan
- ✅ Tests E2E pasan
- ✅ Lint (opcional, no bloquea)

---

## 🚀 Deploy to GitHub Pages

**Archivo:** `.github/workflows/deploy.yml`

### Trigger
```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:  # Manual si es necesario
```

### Jobs

#### 1. Build
**Propósito:** Compilar producción con secretos reales

**Pasos:**
1. Checkout
2. Setup Node.js 20
3. Generar `firebase.config.ts` desde secrets
4. Generar `reviews-config.js` desde secrets
5. Instalar dependencias (`npm ci`)
6. Build producción (`npm run build:prod`)
7. Setup Pages
8. Subir artifact `dist/easy-locker-angular`

**Secretos requeridos:**
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`
- `GOOGLE_API_KEY` (Reviews)
- `GOOGLE_PLACE_ID` (Reviews)

**Permisos:** `contents: read`, `pages: write`, `id-token: write`

#### 2. Deploy
**Propósito:** Publicar a GitHub Pages

**Environment:** `github-pages`

**Paso:**
- Deploy pages artifact

### Cuándo se ejecuta
- ✅ Merge de PR a `main` (típicamente desde `develop` vía release PR)
- ✅ Manual desde Actions (`workflow_dispatch`)

### Concurrency
```yaml
group: "pages"
cancel-in-progress: false
```
Solo un deploy a la vez, no cancela en progreso.

---

## 📦 Create Release PR

**Archivo:** `.github/workflows/create-release-pr.yml`

### Trigger
```yaml
on:
  workflow_dispatch:  # Solo manual
```

### Jobs

#### open-release-pr
**Propósito:** Crear o reusar PR `develop` → `main`

**Pasos:**
1. Checkout
2. Buscar PRs abiertas `develop` → `main`
3. Si existe → reusar
4. Si no existe → crear nueva PR con título "Release: sync develop → main"

**Título:** `Release: sync develop → main`

**Body:**
```
PR automática para preparar el despliegue a producción.

- Base: main
- Head: develop
- Acción: mergear para lanzar el workflow de deploy a GitHub Pages.

Si ya existe una PR abierta entre estas ramas, se reutiliza.
```

**Permisos:** `contents: write`, `pull-requests: write`

**Token:** Intenta usar `PR_CREATOR_TOKEN` (secret), fallback a `GITHUB_TOKEN`

### Cuándo usarlo
- ✅ Cuando `develop` está listo para producción
- ✅ Se acumularon varios features y están validados
- ✅ Se hizo testing manual en staging (si aplica)

### Proceso recomendado
1. Ejecutar workflow desde Actions
2. Revisar la PR creada
3. Mergear PR → triggerea deploy automático

---

## 🔄 Update Google Reviews Cache

**Archivo:** `.github/workflows/update-reviews.yml`

### Trigger
```yaml
on:
  schedule:
    - cron: '0 3 * * 1'  # Lunes 03:00 UTC
  workflow_dispatch:      # Manual
```

### Jobs

#### refresh-reviews
**Propósito:** Actualizar cache multilenguaje de reviews de Google

**Pasos:**
1. Checkout con historial (`fetch-depth: 0`)
2. Instalar `jq` (procesamiento JSON)
3. Fetch reviews de Google Places API v1 en 7 idiomas:
   - Base en `en` (orden estable, info de autor)
   - Traduciones en: `es`, `fr`, `de`, `it`, `pt`, `ko`
4. Combinar por índice en un JSON unificado
5. Normalizar campos (autor, rating, fecha, idioma original, traducciones)
6. Limitar a 6 reviews top
7. Guardar en `src/assets/data/google-reviews.json`
8. Si hay cambios → commit y push

**Commit:** `chore: refresh google reviews cache`

**Secretos requeridos:**
- `GOOGLE_API_KEY`
- `GOOGLE_PLACE_ID`

**Permisos:** `contents: write`

### Cuándo se ejecuta
- ✅ Cada lunes a las 03:00 UTC (automático)
- ✅ Manual desde Actions si se necesita refrescar antes

### Idiomas soportados
`en`, `es`, `fr`, `de`, `it`, `pt`, `ko`

---

## 🔧 Configuración de secretos

### Secrets requeridos en GitHub

| Secret | Usado en | Descripción |
|--------|----------|-------------|
| `FIREBASE_API_KEY` | Deploy | Firebase API key |
| `FIREBASE_AUTH_DOMAIN` | Deploy | Firebase auth domain |
| `FIREBASE_PROJECT_ID` | Deploy | Firebase project ID |
| `FIREBASE_STORAGE_BUCKET` | Deploy | Firebase storage bucket |
| `FIREBASE_MESSAGING_SENDER_ID` | Deploy | Firebase messaging sender |
| `FIREBASE_APP_ID` | Deploy | Firebase app ID |
| `FIREBASE_MEASUREMENT_ID` | Deploy | Firebase measurement ID |
| `GOOGLE_API_KEY` | Deploy, Reviews | Google Places API key |
| `GOOGLE_PLACE_ID` | Deploy, Reviews | Google Place ID |
| `PR_CREATOR_TOKEN` | Release PR | PAT con `repo` y `pull_requests:write` (opcional) |

### Cómo configurar secrets
1. GitHub repo → Settings → Secrets and variables → Actions
2. New repository secret
3. Añadir cada secret con su valor

---

## 📊 Flujo completo de trabajo

### Feature development
```
1. Crear rama feature/xxx desde develop
2. Desarrollar y commit
3. Abrir PR a develop
4. ✅ CI Tests & Quality ejecuta automáticamente
   - Validación SEO
   - Build check
   - Unit tests
   - E2E tests
5. Si pasa → merge a develop
```

### Release a producción
```
1. develop está listo
2. Ejecutar workflow "Create Release PR" (manual)
3. Revisar PR generada develop → main
4. ✅ CI Tests & Quality ejecuta automáticamente
5. Si pasa → merge PR a main
6. ✅ Deploy to GitHub Pages ejecuta automáticamente
7. Sitio actualizado en minutos
```

### Hotfix urgente
```
1. Crear rama hotfix/xxx desde main
2. Fix crítico
3. Abrir PR a main
4. ✅ CI Tests & Quality ejecuta automáticamente
5. Merge → deploy automático
6. (Opcional) Cherry-pick a develop
```

---

## 🚨 Troubleshooting

### CI Tests falla en PR

**Síntoma:** Workflow rojo en PR

**Diagnóstico:**
1. Revisar log del job que falló
2. Común: tests E2E fallan por timeout o cambio visual

**Solución:**
- Fix el código
- Re-ejecutar workflow desde GitHub UI
- Si es test flaky → revisar `e2e/*.spec.ts`

### Deploy falla

**Síntoma:** Build o deploy falla en main

**Diagnóstico:**
1. Revisar log del job `build` o `deploy`
2. Común: secreto faltante o Firebase config incorrecto

**Solución:**
- Verificar todos los secrets configurados
- Re-ejecutar workflow
- Si persiste → rollback merge

### SEO validation alerta pero no bloquea

**Síntoma:** Comentario en PR sobre cambios SEO

**Comportamiento esperado:** 
- El workflow **no bloquea** el merge
- Solo alerta al equipo

**Acción:**
1. Leer el comentario
2. Verificar [normas críticas SEO](./normas-criticas-seo.md)
3. Registrar en [SEO changelog](./seo-changelog.md)
4. Si procede → merge

### Reviews cache no actualiza

**Síntoma:** Workflow ejecuta pero no hace commit

**Diagnóstico:**
- No hubo cambios en las reviews (Google no tiene nuevas)
- API key sin cuota o expirada

**Solución:**
- Verificar en log: `No review updates to commit` = OK
- Si error de API → revisar secret `GOOGLE_API_KEY`

---

## 🔮 Mejoras futuras

### A considerar
- [ ] Pre-commit hooks locales (husky + lint-staged)
- [ ] Coverage reports de tests
- [ ] Lighthouse CI en PRs
- [ ] Notificaciones a Slack/Discord
- [ ] Deploy preview en PRs (ej. Netlify preview)
- [ ] Automatic dependency updates (Dependabot)

---

## 📖 Ver también
- [Cómo desplegar](../how-to/desplegar.md)
- [Actualizar reviews de Google](../how-to/actualizar-reviews.md)
- [Tests UI (Playwright)](../how-to/tests-ui.md)
- [Normas críticas SEO](./normas-criticas-seo.md)
- [SEO Changelog](./seo-changelog.md)
