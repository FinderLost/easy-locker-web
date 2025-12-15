---
title: Editar contenido (i18n)
description: Cómo actualizar textos, links e imágenes en el sitio vía es.json y componentes relacionados.
tags: [how-to, contenido, i18n, frontend]
owner: web-team
last_updated: 2025-12-15
status: approved
llm_summary: Pasos para editar textos, enlaces e imágenes en el sitio usando src/assets/i18n/es.json y el array de FAQs en Angular.
---

# 📝 Instrucciones de Edición - Easy Locker

Este documento explica cómo personalizar el contenido de la web sin necesidad de programar.

## 🎯 Archivo Principal de Edición

**Archivo:** `src/assets/i18n/es.json`

Este archivo contiene todos los textos editables de la web. El enlace de reserva (`hero.links.reserve`) se reutiliza en Pricing para el CTA de cada plan.

---

## 📍 Sección HERO (Parte Superior)

Claves en `hero`:
```json
"title": "Consignas inteligentes en Córdoba",
"subtitle": "Explora más, carga menos",
"availability": "Acceso 24/7",
"buttons": {
  "reserve": "Reservar ahora",
  "directions": "Cómo llegar"
},
"links": {
  "reserve": "https://...",
  "maps": "https://www.google.com/maps/dir/?api=1&destination=..."
}
```

- Cambia `hero.links.reserve` por tu URL real de reservas (se usa también en Pricing).
- Cambia `hero.links.maps` por la dirección de tu local en Google Maps.

---

## 💰 Sección PLANES (lockerSizes)

Claves en `lockerSizes`:
```json
"title": "Planes de consigna",
"subtitle": "Elige el espacio que mejor encaja con tu equipaje",
"plans": {
  "m": {
    "name": "Tamaño M",
    "price": "5 €/día",
    "dimensions": "28 cm x 41 cm x 56 cm",
    "description": "Cabe una maleta pequeña o mochila."
  },
  "l": {
    "name": "Tamaño L",
    "price": "7 €/día",
    "dimensions": "50 cm x 41 cm x 56 cm",
    "description": "Caben dos maletas pequeñas, dos mochilas o una maleta grande."
  },
  "xl": {
    "name": "Tamaño XL",
    "price": "10 €/día",
    "dimensions": "82 cm x 41 cm x 56 cm",
    "description": "Cabe una maleta grande y dos pequeñas, cuatro maletas pequeñas o cuatro mochilas."
  }
}
```

Imágenes usadas en el componente Pricing (puedes reemplazar manteniendo nombres):
- `assets/images/box-type-m.png`
- `assets/images/box-type-l.png`
- `assets/images/box-type-xl.png`

---

## ❓ Sección FAQs

- Texto de sección: `sections.faq.title` y `sections.faq.subtitle`.
- Preguntas/respuestas actuales: `faq_q1`…`faq_q9` y `faq_a1`…`faq_a9`. El componente usa un array con 9 entradas en `src/app/components/faq/faq.component.ts`.

**Para editar o añadir preguntas:**
1. Actualiza o añade claves `faq_qN` / `faq_aN` en `es.json`.
2. Ajusta el array `faqs` en `src/app/components/faq/faq.component.ts` para reflejar la misma cantidad y orden.
3. (Opcional) Replica en otros idiomas para mantener la localización completa.

---

## 🦶 Sección FOOTER

Claves principales: `footer_contact`, `footer_terms`, `footer_privacy`, `footer_email`, `footer_copyright`, además de textos adicionales (`footer_description`, badges y redes).

---

## 🎨 Colores y Diseño

Los colores se mantienen según el diseño actual. Si necesitas cambiarlos, edita:
`tailwind.config.js`

---

## 🚀 Cómo Aplicar los Cambios

1. Edita el archivo `src/assets/i18n/es.json`
2. Guarda los cambios
3. La web se actualizará automáticamente si está en modo desarrollo
4. Si no ves los cambios, recarga la página (F5)

---

## ✅ Checklist de Personalización

- [ ] Cambiar título y subtítulo del Hero
- [ ] Actualizar link de reserva (`hero_reserve_link`)
- [ ] Actualizar link de Google Maps (`hero_maps_link`)
- [ ] Agregar 3 imágenes de planes en `src/assets/images/`
- [ ] Editar títulos y descripciones de los 3 planes
- [ ] Personalizar preguntas y respuestas del FAQ
- [ ] Actualizar información del footer (email, copyright)

---

## 📞 Soporte

Si necesitas ayuda adicional, contacta al desarrollador.

---

**See also:** [Gestionar imágenes de planes](../how-to/imagenes-planes.md) | [Cambios realizados](../reference/cambios-realizados.md)
