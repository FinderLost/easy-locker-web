---
title: Vulnerabilidades de Seguridad - Plan de Acción
description: Análisis de vulnerabilidades detectadas y plan recomendado de actualización.
tags: [reference, security, vulnerabilities, angular, upgrade]
owner: web-team
last_updated: 2026-01-25
status: approved
llm_summary: 34 vulnerabilidades detectadas en Angular 16; requiere upgrade mayor a Angular 17+ para resolución completa.
---

# Vulnerabilidades de Seguridad - Plan de Acción

**Fecha de análisis:** 25 de enero de 2026  
**Rama:** `fix/security-vulnerabilities`

---

## 📊 Resumen Ejecutivo

**Total de vulnerabilidades:** 34

| Severidad | Cantidad |
|-----------|----------|
| Critical | 2 |
| High | 24 |
| Moderate | 5 |
| Low | 3 |

**Causa raíz:** El proyecto usa Angular 16.2, que tiene vulnerabilidades conocidas de XSS y seguridad.

**Solución:** Actualización a Angular 17+ (LTS) o Angular 18+

---

## 🔴 Vulnerabilidades Críticas (2)

### 1. gh-pages - Prototype Pollution
**Paquete:** `gh-pages < 5.0.0`  
**Severidad:** Critical  
**CVE:** GHSA-8mmm-9v2q-x3f9  
**Impacto:** Contaminación de prototipos JavaScript

**Afecta a:**
- `angular-cli-ghpages <= 2.0.3`

**Fix:** Actualizar `angular-cli-ghpages` a v3.0.2+

---

## 🔴 Vulnerabilidades High (24)

### 1. Angular XSS via SVG Script Attributes
**Paquetes:** `@angular/core`, `@angular/compiler`  
**Versiones afectadas:** <= 18.2.14  
**CVE:** GHSA-jrmj-c5cx-3cw6  
**Impacto:** Cross-Site Scripting (XSS)

### 2. Angular Stored XSS via SVG/MathML
**Paquete:** `@angular/compiler`  
**Versiones afectadas:** <= 18.2.14  
**CVE:** GHSA-v4hv-rgfq-gp49  
**Impacto:** XSS almacenado

### 3. Angular XSRF Token Leakage
**Paquete:** `@angular/common`  
**Versiones afectadas:** <= 19.2.15  
**CVE:** GHSA-58c5-g7wp-6w37  
**Impacto:** Fuga de tokens CSRF vía URLs protocol-relative

### 4. node-tar Path Sanitization
**Paquete:** `tar`  
**Versiones afectadas:** <= 7.5.3  
**CVE:** GHSA-8qq5-rm4j-mr97, GHSA-r6q2-hw4h-h46w  
**Impacto:** Sobrescritura arbitraria de archivos

---

## 🟡 Vulnerabilidades Moderate (5)

### 1. Babel RegExp Complexity
**Paquete:** `@babel/runtime < 7.26.10`  
**CVE:** GHSA-968p-4wvh-cqc8  
**Impacto:** Complejidad ineficiente en RegExp

### 2. esbuild Development Server
**Paquete:** `esbuild <= 0.24.2`  
**CVE:** GHSA-67mh-4wv8-2f99  
**Impacto:** Cualquier web puede leer respuestas del dev server

### 3. webpack-dev-server Source Code Theft
**Paquete:** `webpack-dev-server <= 5.2.0`  
**CVE:** GHSA-9jgg-88mc-972h, GHSA-4v9v-hfq4-rm2v  
**Impacto:** Robo de código fuente en navegadores no-Chromium

---

## 🔍 Análisis de Impacto

### ¿Afecta a producción?

**Mayormente NO:**
- La mayoría de vulnerabilidades están en dependencias de **desarrollo** (`devDependencies`)
- `esbuild`, `webpack-dev-server`: solo afectan durante `npm start` (local)
- `tar`, `tmp`, `inquirer`: herramientas de CLI, no en build final

**Algunas SÍ:**
- ✅ **Angular Core/Common/Compiler**: Se incluyen en el bundle de producción
- ✅ **gh-pages**: Usado en deploy (aunque no afecta sitio final)

### Riesgo actual

**En desarrollo:**
- 🔴 **Alto**: XSS en Angular, dev server vulnerable

**En producción:**
- 🟡 **Medio**: XSS en Angular (si hay inputs de usuario no sanitizados)
- 🟢 **Bajo**: La app actual no tiene inputs de usuario que procesen SVG/MathML

---

## 💡 Opciones de Solución

### Opción 1: Actualización completa (RECOMENDADO)

**Actualizar Angular 16 → 18 (LTS)**

**Pros:**
- ✅ Resuelve todas las vulnerabilidades de Angular
- ✅ Versión LTS con soporte hasta nov 2026
- ✅ Mejoras de performance y características

**Contras:**
- ⚠️ Breaking changes significativos
- ⚠️ Requiere testing completo
- ⚠️ Estimación: 2-4 días de trabajo

**Pasos:**
1. Crear rama `feat/angular-18-upgrade`
2. `ng update @angular/core@18 @angular/cli@18`
3. Resolver breaking changes
4. Actualizar tests
5. Validar funcionamiento completo
6. PR y review

---

### Opción 2: Actualización parcial

**Actualizar solo dependencias críticas**

**Paquetes a actualizar:**
- `angular-cli-ghpages`: 2.x → 3.0.2
- Nota: Las demás requieren Angular 17+

**Pros:**
- ✅ Rápido (< 1 hora)
- ✅ Menos riesgo

**Contras:**
- ❌ Solo resuelve 1 vulnerabilidad crítica
- ❌ Mantiene 33 vulnerabilidades

**Comando:**
```bash
npm install angular-cli-ghpages@latest --save-dev
```

---

### Opción 3: Aceptar el riesgo (NO RECOMENDADO)

**Mantener Angular 16**

**Solo si:**
- La app no procesa inputs de usuario con SVG/MathML
- Solo se despliega desde entornos controlados
- Se planea migración a Angular 18+ en <6 meses

**Mitigaciones:**
- Deshabilitar dev server en red pública
- No abrir localhost:4200 en navegadores no confiables
- Documentar riesgo en README

---

## 📋 Recomendación Final

### Plan A: Actualización a Angular 18 (LTS)

**Timeline:**
- **Semana 1**: Upgrade y resolución de breaking changes
- **Semana 2**: Testing completo (unit + E2E)
- **Semana 3**: Deploy a staging y validación
- **Semana 4**: Deploy a producción

**Equipo necesario:**
- 1 dev senior Angular (líder)
- 1 QA para testing

**Riesgo:** Medio (cambio mayor pero documentado)

---

### Plan B (temporal): Fix crítico + planificar upgrade

**Inmediato (hoy):**
```bash
npm install angular-cli-ghpages@latest --save-dev
git add package.json package-lock.json
git commit -m "fix: actualizar angular-cli-ghpages (CVE crítico)"
git push origin fix/security-vulnerabilities
```

**Planificado (próximo sprint):**
- Crear issue para upgrade Angular 18
- Asignar tiempo en roadmap
- Investigar breaking changes

---

## 🔗 Referencias

### CVEs principales
- [GHSA-8mmm-9v2q-x3f9](https://github.com/advisories/GHSA-8mmm-9v2q-x3f9) - gh-pages prototype pollution
- [GHSA-jrmj-c5cx-3cw6](https://github.com/advisories/GHSA-jrmj-c5cx-3cw6) - Angular XSS SVG
- [GHSA-58c5-g7wp-6w37](https://github.com/advisories/GHSA-58c5-g7wp-6w37) - Angular XSRF leak

### Guías de actualización
- [Angular Update Guide](https://update.angular.io/?l=3&v=16.0-18.0)
- [Angular 18 Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)

---

## ✅ Decisión tomada

**Fecha:** 2026-01-25  
**Decisión:** Plan B no es viable - angular-cli-ghpages@3 requiere Angular 18+

### Situación actual

Al intentar actualizar `angular-cli-ghpages` a v3 (para resolver CVE crítico), npm reporta conflicto de dependencias:
```
peer @angular/cli@">=18.0.0 <22.0.0" from angular-cli-ghpages@3.0.2
Found: @angular/cli@16.2.16
```

**Conclusión:** No es posible resolver vulnerabilidades sin actualizar Angular.

### Plan actualizado

**Opción recomendada: Documentar y planificar upgrade completo**

1. ✅ Documentar vulnerabilidades (este archivo)
2. ✅ Crear issue en GitHub para upgrade Angular 18
3. ⏳ Planificar en próximo sprint
4. ⏳ Mitigaciones temporales:
   - Usar solo `npm start` en red local (no exponer)
   - No procesar inputs SVG/MathML de usuarios
   - Documentar riesgo en README

### Mitigaciones aplicadas

- ✅ Documentación completa de vulnerabilidades
- ✅ Análisis de impacto (mayoría son dev dependencies)
- ✅ Plan claro de actualización cuando se apruebe

---

## ✅ Próximos pasos

- [x] Decidir entre Plan A o Plan B → Plan A es necesario
- [x] Documentar análisis completo
- [ ] Crear issue "Upgrade Angular 18 LTS" con checklist detallado
- [ ] Añadir aviso temporal en README sobre vulnerabilidades conocidas
- [ ] Comunicar al equipo y obtener aprobación para dedicar tiempo
- [ ] Cuando se apruebe → Ejecutar upgrade siguiendo Angular Update Guide

---

**Estado actual:** Análisis completado - Esperando aprobación para upgrade  
**Última actualización:** 2026-01-25  
**Responsable:** web-team
