---
title: Cambios realizados (changelog)
description: Resumen funcional de cambios aplicados al sitio Easy Locker Web.
tags: [reference, changelog, release-notes]
owner: web-team
last_updated: 2025-12-15
status: approved
llm_summary: Changelog narrativo con secciones hero, pricing, FAQ, footer y archivos tocados en la última iteración.
---

# ✅ Cambios Realizados - Easy Locker Web

## 📋 Resumen de Actualizaciones

Se ha actualizado la web según el mockup proporcionado, manteniendo los colores y diseño existentes.

---

## 🎯 Cambios Implementados

### 1. ✨ Sección HERO (Superior)
**Antes:** Un solo botón de llamada a la acción
**Ahora:** 
- ✅ Título: "CONSIGNAS INTELIGENTES EN CÓRDOBA"
- ✅ Subtítulo breve editable
- ✅ **Dos botones** con estilo minimalista (bordes redondeados):
  - "RESERVA TU LOCKER" → Abre el link de reserva que configures
  - "OPEN GOOGLE MAPS DIRECTIONS" → Abre Google Maps con la dirección del local

### 2. 💰 Nueva Sección: PLANES Y PRECIOS
**Nuevo componente creado:**
- ✅ Título: "PLANES Y PRECIOS"
- ✅ **3 tarjetas** con diseño de cuadrícula responsive
- ✅ Cada tarjeta incluye:
  - Imagen (placeholder con ícono si no hay imagen)
  - Título del plan
  - Descripción del plan
  - Botón "RESERVA" con estilo minimalista
- ✅ **Totalmente editable** desde `es.json`
- ✅ Imágenes se colocan en `src/assets/images/` (plan1.jpg, plan2.jpg, plan3.jpg)

### 3. ❓ Sección FAQs Simplificada
**Antes:** 3 preguntas de ejemplo
**Ahora:**
- ✅ **1 pregunta básica** de ejemplo
- ✅ Fácil de agregar más preguntas editando el componente
- ✅ Diseño accordion interactivo mantenido

### 4. 🦶 Footer
**Mantenido:**
- ✅ Diseño y estructura original
- ✅ Enlaces de contacto, términos y privacidad
- ✅ Copyright editable desde `es.json`

---

## 🗂️ Estructura de la Web (Orden)

1. **Header** (navegación)
2. **Hero** (título, subtítulo, 2 botones)
3. **Pricing** (planes y precios - NUEVO)
4. **FAQs** (preguntas frecuentes - simplificado)
5. **Footer** (información de contacto)

**Eliminados:** 
- ❌ `how-it-works` (cómo funciona)
- ❌ `location` (ubicación)
- ❌ `features` (características)

---

## 📁 Archivos Nuevos Creados

1. **Componente Pricing:**
   - `src/app/components/pricing/pricing.component.ts`
   - `src/app/components/pricing/pricing.component.html`
   - `src/app/components/pricing/pricing.component.css`

2. **Documentación:**
   - `docs/how-to/editar-contenido.md` - Guía completa de edición
   - `docs/how-to/imagenes-planes.md` - Instrucciones para imágenes
   - `docs/reference/cambios-realizados.md` - Este archivo

3. **Directorio:**
   - `src/assets/images/` - Para las imágenes de los planes

---

## 📝 Archivos Modificados

1. **`src/app/app.component.html`**
   - Actualizada estructura de componentes
   - Eliminados componentes no necesarios

2. **`src/app/components/hero/hero.component.html`**
   - Cambiado a 2 botones con diseño minimalista
   - Botones con bordes redondeados (rounded-full)

3. **`src/app/components/hero/hero.component.ts`**
   - Agregadas funciones `onReserve()` y `onDirections()`
   - Abren URLs configurables desde `es.json`

4. **`src/app/components/faq/faq.component.ts`**
   - Reducido a 1 pregunta de ejemplo

5. **`src/assets/i18n/es.json`**
   - Agregadas traducciones para Hero (botones y links)
   - Agregadas traducciones para Pricing (títulos, descripciones, imágenes)
   - Actualizadas traducciones de FAQs

---

## 🎨 Diseño y Colores

✅ **Mantenidos los colores originales:**
- Azul primario (brand-primary)
- Verde secundario (brand-secondary)
- Gradientes existentes

✅ **Estilo de botones actualizado:**
- Fondo blanco con borde negro
- Hover: fondo negro con texto blanco
- Bordes completamente redondeados (rounded-full)
- Efecto de elevación al hover

---

## 🚀 Próximos Pasos para Personalizar

### 1. Editar Textos y Enlaces
Abre: `src/assets/i18n/es.json`
- Cambia `hero_reserve_link` por tu URL de reserva
- Cambia `hero_maps_link` por tu dirección de Google Maps
- Edita títulos y descripciones de los planes

### 2. Agregar Imágenes de Precios
1. Coloca 3 imágenes en: `src/assets/images/`
2. Nómbralas: `plan1.jpg`, `plan2.jpg`, `plan3.jpg`
3. Tamaño recomendado: 800x600 píxeles

### 3. Agregar Más Preguntas al FAQ
Edita: `src/app/components/faq/faq.component.ts`
Agrega más elementos al array `faqs`

---

## ✅ Compilación

✅ **Build exitoso:**
- Tamaño total: 305.48 kB
- Sin errores
- Listo para producción

---

## 📞 Soporte

Para más información, consulta `docs/how-to/editar-contenido.md`
