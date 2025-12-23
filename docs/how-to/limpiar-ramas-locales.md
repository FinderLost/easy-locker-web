---
title: Limpiar ramas locales antes de desarrollo
description: Protocolo para eliminar ramas locales antiguas y dejar solo develop y la rama de trabajo antes de iniciar un nuevo desarrollo.
tags: [how-to, git, ramas, limpieza]
owner: web-team
last_updated: 2025-12-23
status: approved
llm_summary: Guía para limpiar ramas locales y evitar confusión antes de empezar un desarrollo nuevo.
---

# Cómo limpiar ramas locales antes de un desarrollo

Antes de iniciar un nuevo desarrollo, es recomendable dejar solo la rama `develop` y la rama de trabajo activa. Esto evita confusiones, errores de base y ramas obsoletas.

## Pasos para limpiar ramas locales

1. **Verifica las ramas existentes**
   - `git branch --list`
2. **Identifica la rama de trabajo y develop**
   - Mantén solo `develop` y la rama en la que vas a trabajar (ejemplo: `fix/seo-robots-home`).
3. **Elimina las ramas locales que no necesitas**
   - `git branch -D <nombre-rama>`
   - Ejemplo para borrar varias:
     ```sh
     git branch -D chore/release-pr-workflow chore/release-pr-workflow-v2 feat/seo-canonical-single-lang feat/seo-cookies-multilang feat/seo-prefijo-idioma-spa
     ```
4. **Confirma que solo quedan las ramas deseadas**
   - `git branch --list`

## Notas
- Este paso es obligatorio antes de empezar cualquier feature o fix.
- Si necesitas limpiar ramas remotas, consulta la guía correspondiente.

---

> _Mantener el entorno limpio reduce errores y acelera el flujo de trabajo._
