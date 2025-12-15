---
title: Gestionar imágenes de planes
description: Dónde colocar y cómo referenciar las imágenes de los planes/pricing.
tags: [how-to, imágenes, pricing, frontend]
owner: web-team
last_updated: 2025-12-15
status: approved
llm_summary: Pasos para subir imágenes de planes a src/assets/images y enlazarlas desde es.json.
---

# 🖼️ Gestionar imágenes de planes

Esta guía cubre solo las imágenes usadas en la sección de planes/pricing.

## Dónde colocar las imágenes
- Carpeta: `src/assets/images/`
- Nombres actuales usados por el componente: `box-type-m.png`, `box-type-l.png`, `box-type-xl.png`.
- Puedes reemplazarlos manteniendo el nombre/extension o actualizar el array `plans` en [src/app/components/pricing/pricing.component.ts](../../src/app/components/pricing/pricing.component.ts).

## Cómo referenciarlas
El componente ya apunta a `assets/images/box-type-*.png`. Si cambias nombres o añades variantes, edita el array `plans` en [pricing.component.ts](../../src/app/components/pricing/pricing.component.ts) para actualizar `image`.

## Pasos rápidos
1) Copia las imágenes a `src/assets/images/`
2) Ajusta las claves `pricing_plan*_image` en el JSON
3) Refresca el navegador si estás en dev

## Problemas comunes
- **No se ve la imagen:** revisa ruta relativa (`assets/images/...`) y extensión.
- **Carga lenta:** comprime a <500 KB y usa WebP si es posible.

---

**See also:** [Editar contenido](editar-contenido.md) | [Guía de imágenes (referencia)](../../src/assets/images/README.md)
