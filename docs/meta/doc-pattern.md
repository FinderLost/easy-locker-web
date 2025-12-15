---
title: Patrón de documentación (LLM-friendly)
description: Convenciones para estructurar, nombrar y mantener la documentación utilizable por personas y agentes LLM.
tags: [meta, docs, diataxis, llm]
owner: web-team
last_updated: 2025-12-15
status: approved
llm_summary: Patrón aplicado: docs/ + Diataxis (how-to, referencia, meta), un tema por archivo, frontmatter y enlaces estables para RAG/LLM.
---

# Patrón de documentación (LLM-friendly)

Este proyecto usa un esquema simple inspirado en Diataxis y en buenas prácticas de RAG/LLM para que la documentación sea fácil de consumir y mantener.

## Estructura
- `docs/index (README).md`: índice único.
- `docs/how-to/`: tareas paso a paso (operar, configurar, desplegar).
- `docs/reference/`: verdad única de datos y catálogos (changelog, variables, endpoints, configuraciones).
- `docs/meta/`: convenciones, este patrón y checklists.
- (Opcional) `docs/concepts/`: modelos mentales, glosario, arquitectura.
- (Opcional) `docs/tutorials/`: recorridos de extremo a extremo.
- (Opcional) `docs/adr/`: decisiones (`ADR-YYYY-MM-DD-titulo.md`).

## Metadatos
Cada archivo empieza con frontmatter YAML consistente:
```
---
title: ...
description: ...
tags: [how-to|reference|meta, ...]
owner: web-team
last_updated: YYYY-MM-DD
status: draft|approved|deprecated
llm_summary: 1-2 frases para agentes
---
```

## Convenciones de contenido
- Un tema por archivo; títulos claros y estables.
- Secciones cortas (~200-400 palabras) con encabezados cada 3-6 párrafos.
- Nombres en kebab-case, sin espacios ni tildes en el nombre del archivo.
- Enlaces relativos y "See also" para evitar duplicar contenido.
- Preferir `.md`; si hay imágenes/diagramas, añadir un resumen textual.
- Marcar documentos obsoletos con `status: deprecated` y apuntar al reemplazo.

## Flujo de mantenimiento
- Al añadir una feature: actualiza el how-to si afecta operación, añade referencia si cambian datos/config, crea ADR si es una decisión arquitectónica.
- En cada PR, verifica que `last_updated` se refresca en los archivos tocados.
- Usa el índice en `docs/` para añadir nuevas entradas y mantener el mapa coherente.

## Por qué funciona para LLM
- Frontmatter facilita el ranking/filtrado de fragmentos.
- Archivos pequeños y unívocos reducen ruido en RAG.
- Encabezados estables y anclas predecibles mejoran la navegación y las citas.
