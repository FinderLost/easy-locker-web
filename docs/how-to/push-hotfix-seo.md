---
title: Subir cambios a remoto tras fix crítico SEO
description: Checklist y recordatorio para hacer push de ramas de hotfix SEO y no olvidar el paso antes de PR/despliegue.
tags: [how-to, git, seo, hotfix]
owner: web-team
last_updated: 2025-12-23
status: approved
llm_summary: Guía rápida para no olvidar hacer push tras arreglos críticos de SEO, incluyendo comandos y validación.
---

# Cómo subir cambios críticos de SEO a remoto

Cuando se realiza un fix urgente de SEO (por ejemplo, quitar `noindex` de la home), es fundamental subir la rama al remoto antes de crear el Pull Request o desplegar. Olvidar este paso puede bloquear la revisión y el despliegue.

## Pasos recomendados

1. **Verifica que los cambios están en la rama correcta**
   - Usa `git status` y `git branch` para confirmar.
2. **Haz commit de los cambios**
   - `git add .`
   - `git commit -m "fix(seo): describe el cambio realizado"`
3. **Sube la rama al remoto**
   - `git push --set-upstream origin <nombre-de-la-rama>`
4. **Confirma en GitHub**
   - Abre el enlace sugerido en consola para crear el Pull Request.

## Validación
- Asegúrate de ver la rama en GitHub y que el PR se puede crear.
- Si es un fix de SEO, revisa que el HTML generado en producción refleje el cambio (ejemplo: `robots` en `index,follow`).

---

> _Este recordatorio ayuda a no saltarse el push en fixes críticos de SEO._
