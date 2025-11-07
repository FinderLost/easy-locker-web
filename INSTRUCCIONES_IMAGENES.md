# 📝 Instrucciones para Editar el Contenido de la Web

## 🎯 TODO EL CONTENIDO SE EDITA EN UN SOLO ARCHIVO JSON

**Archivo principal**: `src/assets/i18n/es.json`

Este archivo contiene TODOS los textos, links e imágenes de la web. Solo necesitas editar este archivo y los cambios se verán automáticamente.

---

## 📋 Estructura del Archivo JSON

### 🏠 **Sección HERO (Portada)**

```json
"hero_title": "CONSIGNAS INTELIGENTES EN CÓRDOBA",
"hero_subtitle": "Subtítulo breve",
"hero_btn_reserve": "RESERVA TU LOCKER",
"hero_btn_directions": "OPEN GOOGLE MAPS DIRECTIONS",
"hero_reserve_link": "https://tu-link-de-reserva.com",
"hero_maps_link": "https://www.google.com/maps/dir//Estación+de+Autobuses+de+Córdoba"
```

**Qué editar:**
- `hero_title`: Título principal en mayúsculas
- `hero_subtitle`: Subtítulo descriptivo
- `hero_btn_reserve`: Texto del botón de reserva
- `hero_btn_directions`: Texto del botón de Google Maps
- `hero_reserve_link`: **IMPORTANTE** - Pon aquí tu link de reserva
- `hero_maps_link`: Link de Google Maps (ya configurado)

---

### 💰 **Sección PLANES Y PRECIOS**

```json
"pricing_title": "PLANES Y PRECIOS",
"pricing_plan1_title": "Plan Básico",
"pricing_plan1_description": "Descripción del plan básico",
"pricing_plan1_image": "assets/images/plan1.jpg",
"pricing_plan2_title": "Plan Estándar",
"pricing_plan2_description": "Descripción del plan estándar",
"pricing_plan2_image": "assets/images/plan2.jpg",
"pricing_plan3_title": "Plan Premium",
"pricing_plan3_description": "Descripción del plan premium",
"pricing_plan3_image": "assets/images/plan3.jpg",
"pricing_btn_reserve": "RESERVA",
"pricing_reserve_link": "https://tu-link-de-reserva.com"
```

**Qué editar:**
- `pricing_title`: Título de la sección
- `pricing_plan1_title`, `pricing_plan2_title`, `pricing_plan3_title`: Nombres de los planes
- `pricing_plan1_description`, etc.: Descripciones de cada plan
- `pricing_plan1_image`, etc.: Rutas de las imágenes (ver sección de imágenes abajo)
- `pricing_btn_reserve`: Texto del botón
- `pricing_reserve_link`: **IMPORTANTE** - Link de reserva

---

### ❓ **Sección FAQs**

```json
"faq_title": "FAQS",
"faq_q1": "¿Cómo funciona el servicio de consignas?",
"faq_a1": "Nuestro servicio de consignas inteligentes te permite..."
```

**Para añadir más preguntas:**

1. Añade en el JSON:
```json
"faq_q2": "Tu segunda pregunta aquí",
"faq_a2": "Tu segunda respuesta aquí",
"faq_q3": "Tu tercera pregunta aquí",
"faq_a3": "Tu tercera respuesta aquí"
```

2. Edita el archivo `src/app/components/faq/faq.component.ts` y añade:
```typescript
faqs = [
  { questionKey: 'faq_q1', answerKey: 'faq_a1', isOpen: false },
  { questionKey: 'faq_q2', answerKey: 'faq_a2', isOpen: false },
  { questionKey: 'faq_q3', answerKey: 'faq_a3', isOpen: false }
];
```

---

## 📸 **Cómo Añadir las Imágenes de los Planes**

1. **Coloca tus imágenes** en la carpeta: `src/assets/images/`

2. **Nombres recomendados:**
   - `plan1.jpg` (o .png, .webp)
   - `plan2.jpg`
   - `plan3.jpg`

3. **Actualiza las rutas en el JSON:**
```json
"pricing_plan1_image": "assets/images/plan1.jpg",
"pricing_plan2_image": "assets/images/plan2.jpg",
"pricing_plan3_image": "assets/images/plan3.jpg"
```

**Formatos recomendados:**
- **Formato**: JPG, PNG o WebP
- **Proporción**: 4:3 (ejemplo: 800x600px)
- **Tamaño**: Máximo 500KB por imagen

---

## 🚀 **Resumen Rápido**

1. ✏️ Edita `src/assets/i18n/es.json` con tus textos y links
2. 📸 Sube tus imágenes a `src/assets/images/`
3. 🔗 Actualiza las rutas de imágenes en el JSON
4. ✅ ¡Listo! Los cambios se verán automáticamente

---

## 🌐 **Para Añadir Más Idiomas (Opcional)**

Crea un archivo `en.json` en la misma carpeta con la misma estructura pero en inglés.
