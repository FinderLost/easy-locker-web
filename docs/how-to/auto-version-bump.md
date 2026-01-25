# Auto Version Bump - Sistema Automático de Versionado

## Propósito

Workflow de GitHub Actions que **incrementa automáticamente** la versión en `package.json` cuando se hace merge de un Pull Request a `main` (producción).

---

## Funcionamiento

### Trigger
Se activa cuando:
- Un PR es **mergeado** (no cerrado sin merge)
- La rama destino es **`main`** (NO develop)

### Proceso

1. **Analiza commits** del PR mergeado
2. **Determina tipo de bump** según Conventional Commits:
   - `feat:` → MINOR (x.Y.x)
   - `fix:`, `docs:`, `style:` → PATCH (x.x.Y)
   - `BREAKING CHANGE:` o `feat!:` → MAJOR (X.x.x)
3. **Incrementa versión** en `package.json` y `package-lock.json`
4. **Crea commit** automático: `chore: bump version to X.Y.Z [skip ci]`
5. **Push directo** a `main`
6. **Crea Git tag** (ej. `v1.2.3`)
7. **Comenta en PR** con detalles del bump

### ⚠️ Importante

- **Solo se ejecuta en merges a `main`** (releases a producción)
- **NO se ejecuta en merges a `develop`** (desarrollo)
- La versión en `develop` se mantiene manual hasta el release

---

## Configuración

### Archivo
`.github/workflows/auto-version-bump.yml`

### Permisos requeridos
```yaml
permissions:
  contents: write  # Para push de commits y tags
```

### Secrets necesarios
- `GITHUB_TOKEN`: Provisto automáticamente por GitHub Actions

---

## Uso

### Para desarrolladores

**No requiere acción manual**. Solo asegúrate de:

1. **Usar Conventional Commits** en tus mensajes:
   ```bash
   git commit -m "feat(seo): optimizar meta descriptions"
   git commit -m "fix: corregir error en footer component"
   git commit -m "docs: actualizar README con nueva sección"
   ```

2. **Mergear PR** normalmente desde GitHub UI

3. **Esperar ~30 segundos**: El workflow se ejecuta automáticamente (solo en `main`)

4. **Verificar**: La versión ya estará actualizada en `main` con tag creado

### Ejemplo práctico

**Escenario 1**: Desarrollo normal → Release

```bash
# 1. Crear rama y commits
git checkout -b feat/add-portuguese
git commit -m "feat(i18n): añadir soporte para portugués"
git commit -m "feat(i18n): traducir todas las claves al portugués"
git push origin feat/add-portuguese

# 2. Crear PR a develop y mergear (GitHub UI)
# ⚠️ NO hay bump automático en develop

# 3. Cuando esté listo para release: PR de develop → main

# 4. Mergear PR a main
# ✅ Resultado automático:
# - Versión: 1.2.0 → 1.3.0 (MINOR porque hubo feat)
# - Commit: "chore: bump version to 1.3.0 [skip ci]"
# - Tag: v1.3.0 creado
# - Push a main
# - Deploy automático con nueva versión
```

**Escenario 2**: Hotfix urgente

```bash
# 1. Crear rama desde main
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix

# 2. Commit hotfix
git commit -m "fix(security): corregir vulnerabilidad XSS"
git push origin hotfix/critical-security-fix

# 3. PR directo a main y mergear
# ✅ Resultado automático:
# - Versión: 1.3.0 → 1.3.1 (PATCH por fix)
# - Tag: v1.3.1 creado
# - Deploy inmediato
```

---

## Convenciones de Commits

### Formato
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Tipos soportados (solo aplica en merges a main)

| Tipo | Descripción | Bump Type |
|------|-------------|-----------|
| `feat` | Nueva funcionalidad | MINOR |
| `fix` | Corrección de bug | PATCH |
| `docs` | Solo documentación | PATCH |
| `style` | Cambios de formato/estilo | PATCH |
| `refactor` | Refactor sin cambio funcional | PATCH |
| `perf` | Mejora de performance | PATCH |
| `test` | Añadir/modificar tests | PATCH | PATCH |
| `chore` | Tareas de mantenimiento | PATCH | PATCH |
| `feat!` o `BREAKING CHANGE:` | Cambio incompatible | PATCH | MAJOR |

### Ejemplos

**Features (MINOR en main, PATCH en develop):**
```bash
feat: añadir página de contacto
feat(auth): implementar login con Google
feat(i18n): agregar soporte para japonés
```

**Fixes (PATCH):**
```bash
fix: corregir cálculo de precios
fix(seo): arreglar canonical URLs duplicados
fix(ui): resolver overflow en móvil
```

**Breaking changes (MAJOR en main, PATCH en develop):**
```bash
feat!: cambiar estructura de URLs

feat: migrar a nuevo sistema de routing

BREAKING CHANGE: URLs ahora usan formato /lang/page en lugar de /page?lang=xx
```

---

## Monitoreo

### Ver ejecuciones recientes
```bash
# Con GitHub CLI
gh run list --workflow=auto-version-bump.yml --limit=10

# Ver logs de última ejecución
gh run view --log
```

### En GitHub UI
1. Ir a repositorio
2. Pestaña "Actions"
3. Workflow "Auto Version Bump"
4. Ver historial de ejecuciones

### Verificar versión actual
```bash
# En develop
git checkout develop
git pull origin develop
cat package.json | grep version

# En main
git checkout main
git pull origin main
cat package.json | grep version

# Tags
git tag -l | tail -5
```

---

## Troubleshooting

### Workflow no se ejecutó

**Síntomas:** PR mergeado pero versión no actualizada.

**Causas posibles:**
1. PR cerrado sin merge (debe ser mergeado)
2. Commits no siguen Conventional Commits
3. Workflow deshabilitado en Settings

**Solución:**
```bash
# Verificar ejecuciones
gh run list --workflow=auto-version-bump.yml

# Si no hay ejecución, bump manual:
git checkout develop
npm version patch
git push origin develop --tags
```

### Error al hacer push

**Síntomas:** Workflow falla con "Permission denied".

**Causa:** Permisos insuficientes para el `GITHUB_TOKEN`.

**Solución:**
1. Ir a Settings → Actions → General
2. Workflow permissions → Seleccionar "Read and write permissions"
3. Guardar y re-ejecutar workflow

### Conflictos en package.json

**Síntomas:** Workflow falla con conflicto al mergear.

**Causa:** Dos PRs mergeados simultáneamente.

**Solución:**
```bash
git checkout develop
git pull origin develop --rebase
# Resolver conflicto en package.json manualmente
npm version patch --force
git push origin develop --tags
```

### Versión incorrecta

**Síntomas:** Bump aplicado pero tipo incorrecto (ej. MINOR en vez de PATCH).

**Causa:** Commits con `feat:` cuando debía ser `fix:`.

**Solución preventiva:** Revisar mensajes de commit antes de mergear PR.

**Solución correctiva:**
```bash
# Revertir versión incorrecta
git checkout develop
npm version 1.2.0  # Volver a versión correcta
git push origin develop --force --tags
```

---

## Desactivación temporal

Si necesitas desactivar el workflow temporalmente:

**Opción 1: Deshabilitar en GitHub**
1. Settings → Actions → Workflows
2. Buscar "Auto Version Bump"
3. Click "..." → Disable workflow

**Opción 2: Renombrar archivo**
```bash
mv .github/workflows/auto-version-bump.yml .github/workflows/auto-version-bump.yml.disabled
git commit -m "chore: disable auto version bump temporarily"
```

**Para reactivar:** Revertir cambios o habilitar desde GitHub UI.

---

## Alternativa: Bump manual

Si prefieres control total o el workflow no está disponible:

```bash
# Determinar tipo de cambio
# - Breaking changes → npm version major
# - Nuevas features → npm version minor
# - Bug fixes → npm version patch

git checkout develop
npm version patch   # o minor / major
git push origin develop --tags
```

**Ventaja:** Control explícito sobre versiones.  
**Desventaja:** Requiere recordar hacerlo manualmente.

---

## Mejoras futuras

Posibles extensiones del workflow:

- [ ] Generar CHANGELOG.md automáticamente
- [ ] Crear GitHub Release con notas auto-generadas
- [ ] Notificar en Slack/Discord tras bump
- [ ] Validar que versión no retrocede
- [ ] Soporte para pre-releases (ej. 1.3.0-beta.1)

---

## Referencias

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [npm version](https://docs.npmjs.com/cli/v10/commands/npm-version)

**Documentos relacionados:**
- [Guía de Versionado](../reference/guia-versionado.md)
- [Workflows CI/CD](../reference/workflows-cicd.md)

---

**Implementado:** 2026-01-25  
**Estado:** Activo  
**Versión del workflow:** 1.0.0
