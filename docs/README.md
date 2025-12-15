---
title: Documentación del proyecto
description: Índice principal de documentación y rutas para how-to, referencia y meta.
tags: [docs, index, frontend]
owner: web-team
last_updated: 2025-12-15
status: approved
llm_summary: Índice y convenciones de documentación (how-to, referencia, meta) para Easy Locker Web siguiendo un patrón Diataxis.
---

# Documentación del proyecto

Este es el índice único de Easy Locker Web. La estructura sigue un patrón tipo Diataxis (how-to, referencia, conceptos/meta) para que personas y agentes LLM encuentren rápido lo que necesitan.

## Mapa rápido
- **How-to**: [Editar contenido](how-to/editar-contenido.md), [Gestionar imágenes de planes](how-to/imagenes-planes.md), [Desplegar a producción](how-to/desplegar.md)
- **Referencia**: [Cambios realizados](reference/cambios-realizados.md), [Config Google Reviews](src/assets/config/reviews-config.js), [Guía de imágenes](src/assets/images/README.md)
- **Meta / patrón**: [Patrón de documentación](meta/doc-pattern.md)

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
