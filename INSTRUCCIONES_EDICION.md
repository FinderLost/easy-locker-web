# 📝 Instrucciones de Edición - Easy Locker

Este documento explica cómo personalizar el contenido de la web sin necesidad de programar.

## 🎯 Archivo Principal de Edición

**Archivo:** `src/assets/i18n/es.json`

Este archivo contiene todos los textos editables de la web.

---

## 📍 Sección HERO (Parte Superior)

### Textos:
```json
"hero_title": "CONSIGNAS INTELIGENTES EN CÓRDOBA",
"hero_subtitle": "Subtítulo breve",
```

### Botones:
```json
"hero_btn_reserve": "RESERVA TU LOCKER",
"hero_btn_directions": "OPEN GOOGLE MAPS DIRECTIONS",
```

### Enlaces (URLs):
```json
"hero_reserve_link": "https://tu-link-de-reserva.com",
"hero_maps_link": "https://www.google.com/maps/dir//Estación+de+Autobuses+de+Córdoba",
```

**Cómo editar:**
- Cambia `hero_reserve_link` por tu URL de reserva real
- Cambia `hero_maps_link` por la dirección de Google Maps de tu local

---

## 💰 Sección PLANES Y PRECIOS

### Título de la sección:
```json
"pricing_title": "PLANES Y PRECIOS",
```

### Plan 1 (Básico):
```json
"pricing_plan1_title": "Plan Básico",
"pricing_plan1_description": "Descripción del plan básico",
"pricing_plan1_image": "assets/images/plan1.jpg",
```

### Plan 2 (Estándar):
```json
"pricing_plan2_title": "Plan Estándar",
"pricing_plan2_description": "Descripción del plan estándar",
"pricing_plan2_image": "assets/images/plan2.jpg",
```

### Plan 3 (Premium):
```json
"pricing_plan3_title": "Plan Premium",
"pricing_plan3_description": "Descripción del plan premium",
"pricing_plan3_image": "assets/images/plan3.jpg",
```

### Botón de reserva:
```json
"pricing_btn_reserve": "RESERVA",
"pricing_reserve_link": "https://tu-link-de-reserva.com",
```

**Cómo agregar las imágenes:**
1. Coloca tus 3 imágenes de precios en: `src/assets/images/`
2. Nómbralas exactamente: `plan1.jpg`, `plan2.jpg`, `plan3.jpg`
3. Tamaño recomendado: 800x600 píxeles

---

## ❓ Sección FAQs

### Título:
```json
"faq_title": "FAQS",
```

### Pregunta y Respuesta de Ejemplo:
```json
"faq_q1": "¿Cómo funciona el servicio de consignas?",
"faq_a1": "Nuestro servicio de consignas inteligentes te permite guardar tu equipaje de forma segura. Solo necesitas reservar online, llegar al punto, usar tu código y guardar tus pertenencias.",
```

**Cómo agregar más preguntas:**
1. Abre el archivo: `src/app/components/faq/faq.component.ts`
2. En el array `faqs`, agrega más elementos:
```typescript
faqs = [
  { questionKey: 'faq_q1', answerKey: 'faq_a1', isOpen: false },
  { questionKey: 'faq_q2', answerKey: 'faq_a2', isOpen: false },
  { questionKey: 'faq_q3', answerKey: 'faq_a3', isOpen: false }
];
```
3. Luego agrega las traducciones en `es.json`:
```json
"faq_q2": "Tu segunda pregunta aquí",
"faq_a2": "Tu segunda respuesta aquí",
"faq_q3": "Tu tercera pregunta aquí",
"faq_a3": "Tu tercera respuesta aquí",
```

---

## 🦶 Sección FOOTER

```json
"footer_contact": "Contacto",
"footer_terms": "Términos y condiciones",
"footer_privacy": "Política de privacidad",
"footer_email": "Email: contacto@easylocker.com",
"footer_copyright": "© 2024 Easy Locker. Todos los derechos reservados.",
```

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
