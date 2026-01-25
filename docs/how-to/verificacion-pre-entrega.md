# Verificación pre-entrega (Agente)

## Propósito

Procedimiento obligatorio que el agente debe ejecutar antes de finalizar cualquier trabajo que involucre cambios en código TypeScript, HTML, CSS o configuraciones de build.

---

## Cuándo aplicar

✅ **Siempre verificar** en estos casos:
- Cambios en componentes Angular (`.ts`, `.html`, `.css`)
- Modificaciones de servicios, pipes, guards, interceptors
- Ajustes en `tsconfig.json`, `angular.json`, `package.json`
- Nuevas dependencias o actualizaciones de paquetes
- Cambios en routing (`app-routing.module.ts`)
- Modificaciones de assets compilados (i18n, config)

🟡 **Verificar si hay tiempo** en estos casos:
- Cambios solo en documentación Markdown (`.md`)
- Ediciones de archivos estáticos (`robots.txt`, `sitemap.xml`)
- Actualizaciones de workflows GitHub Actions (`.yml`)

❌ **No es necesario** verificar:
- Cambios solo en README.md o documentación meta
- Ediciones de scripts standalone sin dependencias del proyecto

---

## Procedimiento paso a paso

### 1. Compilación de producción

```bash
npm run build
```

**Resultado esperado**:
```
✔ Browser application bundle generation complete.
✔ Copying assets complete.
✔ Index html generation complete.

Initial Chunk Files           | Names         |  Raw Size
main.[hash].js                | main          | XXX.XX kB
styles.[hash].css             | styles        | XX.XX kB
polyfills.[hash].js           | polyfills     | XX.XX kB
runtime.[hash].js             | runtime       | XXX bytes

Build at: [timestamp] - Hash: [hash] - Time: [ms]ms
```

**Errores comunes**:
- ❌ `Error: Should not import the named export...` → Usar default import para JSON
- ❌ `Cannot find module...` → Verificar paths en `tsconfig.json`
- ❌ `Type 'X' is not assignable to type 'Y'` → Revisar tipado TypeScript

**Warnings aceptables**:
- ⚠️ `bundle initial exceeded maximum budget` → Budget 500 KB (proyecto actual ~679 KB)
- ⚠️ `baseline-browser-mapping data is over two months old` → No crítico

### 2. Validación de linting (opcional pero recomendado)

```bash
npm run lint
```

**Resultado esperado**:
```
All files pass linting.
```

### 3. Tests unitarios (opcional según contexto)

```bash
npm run test -- --watch=false --browsers=ChromeHeadless
```

**Resultado esperado**:
```
✔ Executed X of X SUCCESS
```

**Cuándo ejecutar tests**:
- Cambios en servicios con lógica compleja
- Modificaciones en componentes con tests existentes
- Refactors importantes

**Cuándo omitir**:
- Cambios puramente visuales (CSS/HTML)
- Ajustes de configuración sin lógica
- Cambios mínimos en texto/i18n

### 4. Verificación manual en desarrollo (opcional)

Si el servidor ya está corriendo:
```bash
# En otra terminal
npm start
```

Visitar: `http://localhost:4200`

**Qué verificar**:
- [ ] Página carga sin errores en consola
- [ ] Funcionalidad modificada opera correctamente
- [ ] No hay regresiones visuales evidentes

---

## Checklist pre-entrega

Antes de finalizar el trabajo, confirmar:

- [ ] ✅ `npm run build` ejecutado y exitoso
- [ ] 📝 Errores de compilación corregidos (si hubo)
- [ ] 🔍 Warnings críticos analizados (si hubo)
- [ ] 📊 Tests ejecutados (si procede por tipo de cambio)
- [ ] 🌐 Verificación visual en localhost (si procede)
- [ ] 📄 Documentación actualizada (si hay nuevas decisiones)
- [ ] 🧠 `CHANGELOG-AGENT.md` actualizado (si cambios significativos)

---

## Comunicación al usuario

### ✅ Si todo compila correctamente

Mensaje conciso:
```
✅ Cambios completados y verificados:
- npm run build: exitoso (XXX KB)
- [Otros checks ejecutados]

Archivos modificados:
- path/to/file.ts
- path/to/file.html
```

### ❌ Si hay errores

Mensaje claro:
```
⚠️ Detectado error de compilación:

Error: [descripción exacta del error]
Archivo: [ruta:línea]

Corrección aplicada:
[Explicación breve de la solución]

✅ Recompilación exitosa tras corrección.
```

---

## Integración con workflow del agente

### Antes de cada entrega
```typescript
// Pseudocódigo del workflow mental del agente

if (cambiosEnCódigo || cambiosEnConfig) {
  ejecutar('npm run build');
  
  if (errorCompilación) {
    analizarError();
    aplicarCorreción();
    ejecutar('npm run build'); // Reintentar
  }
  
  if (cambiosEnLógica) {
    considerar('npm run test');
  }
  
  actualizarCHANGELOG_AGENT();
  comunicarResultadosUsuario();
} else {
  // Cambios solo documentación
  saltarVerificación();
}
```

---

## Ejemplos de casos reales

### Caso 1: Error import JSON (sesión 2026-01-25)

**Error detectado**:
```
./src/app/components/footer/footer.component.ts:51:24-31 - Error: Should not import 
the named export 'version' (imported as 'version') from default-exporting module
```

**Corrección aplicada**:
```typescript
// ❌ Antes
import { version } from '../../../../package.json';
appVersion = version;

// ✅ Después
import packageJson from '../../../../package.json';
appVersion = packageJson.version;
```

**Config requerida** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true
  }
}
```

**Resultado**: Build exitoso tras corrección.

---

## Comandos de referencia rápida

```bash
# Compilación producción
npm run build

# Desarrollo (watch mode)
npm start

# Linting
npm run lint

# Tests unitarios (headless)
npm run test -- --watch=false --browsers=ChromeHeadless

# Tests E2E
npm run e2e

# Validación SEO (si aplica)
npm run seo:check
```

---

## Notas adicionales

- **Tiempo estimado**: Compilación ~7 segundos, tests ~30 segundos
- **Frecuencia**: Obligatorio en cada entrega con cambios de código
- **Responsabilidad**: Agente (automatizado), no delegar al usuario
- **Excepciones**: Solo documentación/markdown puede omitirse

**Actualizado**: 2026-01-25
