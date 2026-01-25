---
title: Documentación del proyecto
description: Índice principal de documentación y rutas para how-to, referencia y meta.
tags: [docs, index, frontend]
owner: web-team
last_updated: 2026-01-25
status: approved
llm_summary: Índice y convenciones de documentación (how-to, referencia, meta) para Easy Locker Web siguiendo un patrón Diataxis.
---

# Documentación del proyecto

Este es el índice único de Easy Locker Web. La estructura sigue un patrón tipo Diataxis (how-to, referencia, conceptos/meta) para que personas y agentes LLM encuentren rápido lo que necesitan.

## Mapa rápido

### 🚀 Inicio rápido
- **[Workflows CI/CD](reference/workflows-cicd.md)** — Pipelines automáticos, deploy, tests
- **[📌 Sistema de Protección SEO](reference/seo-protection-summary.md)** — Resumen ejecutivo
- **[Mejoras del Sistema 2026-01](reference/mejoras-sistema-2026-01.md)** — Últimos cambios

### 📘 How-to (Guías paso a paso)
- [Editar contenido](how-to/editar-contenido.md)
- [Dar de alta un idioma](how-to/dar-alta-idioma.md)
- [Gestionar imágenes de planes](how-to/imagenes-planes.md)
- [Desplegar a producción](how-to/desplegar.md)
- [Actualizar reseñas de Google](how-to/actualizar-reviews.md)
- [Tests UI (Playwright)](how-to/tests-ui.md)
- [Análisis SEO con Screaming Frog](how-to/analisis-seo-screaming-frog.md)
- [Push hotfix SEO](how-to/push-hotfix-seo.md)
- **[Cambios SEO seguros](how-to/cambios-seo-seguros.md)**
- **[Verificación pre-entrega (Agente)](how-to/verificacion-pre-entrega.md)**
- **[Auto Version Bump](how-to/auto-version-bump.md)** — Sistema automático de versionado

### 📚 Referencia (Datos y catálogos)
- [Cambios realizados](reference/cambios-realizados.md)
- **[Workflows CI/CD](reference/workflows-cicd.md)**
- **[Guía de Versionado](reference/guia-versionado.md)**
- **[Propósito y Target del Proyecto](reference/proposito-target.md)** — Estrategia y público objetivo
- [Estado actual del SEO](reference/estado-seo.md)
- **[Normas críticas SEO](reference/normas-criticas-seo.md)**
- **[SEO Changelog](reference/seo-changelog.md)**
- [Plan de acción SEO Enero 2026](reference/plan-accion-seo-2026-01.md)
- [Guía rápida Screaming Frog](reference/screaming-frog-quickstart.md)
- [Estado i18n](reference/i18n-estado-actual.md)
- [Pendientes de pruebas UI/E2E](reference/testing-gaps-ui.md)
- **[Mejoras del Sistema 2026-01](reference/mejoras-sistema-2026-01.md)**
- [Vulnerabilidades de Seguridad](reference/security-vulnerabilities-2026-01.md)

### 🔧 Meta / Patrón
- [Patrón de documentación](meta/doc-pattern.md)
- **[Changelog del Agente (Memoria persistente)](meta/CHANGELOG-AGENT.md)**

## Qué encontrarás en cada categoría
- **How-to**: pasos concretos para tareas operativas (editar textos, imágenes, despliegues). Un archivo por tarea.
- **Referencia**: verdad única sobre cambios, configuraciones y catálogos que no son pasos sino datos. Ej.: changelog, variables, endpoints.
- **Meta**: convenciones, patrón y cómo mantener la documentación actualizada y usable por LLM.

## Convenciones que seguimos
- Un tema por archivo, nombre en kebab-case, títulos claros y estables.
- Metadatos YAML al inicio (`title`, `description`, `tags`, `owner`, `last_updated`, `status`, `llm_summary`) para que los agentes puedan rankear y filtrar.
- Enlaces relativos y "See also" para evitar duplicar contenido.
- Si el archivo supera ~400 palabras, dividir en secciones con encabezados cortos.

## Próximos pasos comunes
- Levantar dev: `npm install` y `npm start`.
- Probar: `npm test`.
- Editar textos/links: ver [Editar contenido](how-to/editar-contenido.md).
- Actualizar imágenes de planes: ver [Gestionar imágenes de planes](how-to/imagenes-planes.md).
