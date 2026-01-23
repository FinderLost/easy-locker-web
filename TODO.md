# 📋 TODO - Easy Locker Web
**Última actualización:** 23 de enero de 2026  
**Proyecto:** Easy Locker Web

---

## 🔴 Prioridad Alta

### 🔒 Seguridad - Actualizar Angular y dependencias vulnerables
**Estado:** Pendiente  
**Estimación:** 2-4 horas + pruebas  
**Riesgo:** Breaking changes en Angular v16 → v21

**Vulnerabilidades actuales:**
- Angular Core: XSS en SVG attributes (HIGH)
- Angular Common: XSRF token leakage (HIGH)
- gh-pages: Prototype pollution (CRITICAL)
- tar: Arbitrary file overwrite (HIGH)
- webpack-dev-server: Source code theft (MODERATE)

**Pasos necesarios:**
1. Crear rama `feat/angular-21-upgrade`
2. Ejecutar `npm audit fix --force`
3. Revisar breaking changes: https://angular.dev/update-guide
4. Actualizar código deprecado
5. Ejecutar tests: `npm test`
6. Verificar build: `npm run build`
7. Probar localmente todas las funcionalidades
8. Merge a develop tras validación

**Documentación:**
- [ ] Crear `docs/reference/angular-21-migration.md` con cambios aplicados

**Referencias:**
- [Angular Update Guide](https://angular.dev/update-guide?v=16.0-21.0)
- [Audit output](ejecutar `npm audit` para ver detalles)

---

### 📊 SEO Post-Deploy - Validaciones en Producción
**Estado:** En espera de deploy  
**Estimación:** 30 minutos  
**Fecha objetivo:** 23-24 enero 2026

**Tareas:**
- [ ] Verificar JSON-LD en https://easy-locker.com
  - Abrir DevTools → Elements → buscar `<script type="application/ld+json">`
  - Verificar todos los datos (nombre, dirección, teléfono, coordenadas)
  
- [ ] Validar en Google Rich Results Test
  - URL: https://search.google.com/test/rich-results
  - Pegar: `https://easy-locker.com`
  - Confirmar detección de LocalBusiness

- [ ] Validar Open Graph en Facebook
  - URL: https://developers.facebook.com/tools/debug/
  - Pegar: `https://easy-locker.com`
  - Verificar imagen social, título y descripción

- [ ] Validar Twitter Card
  - URL: https://cards-dev.twitter.com/validator
  - Pegar: `https://easy-locker.com`
  - Verificar preview de tarjeta

- [ ] Registrar sitemap en Google Search Console
  - URL sitemap: `https://easy-locker.com/sitemap.xml`
  - Monitorear indexación en 24-48h

**Documentación:**
- [ ] Actualizar `docs/reference/estado-seo.md` con resultados de validación

---

## 🟡 Prioridad Media

### 🌐 SEO - Mejoras adicionales
**Estado:** Opcional - Enhancement  
**Estimación:** 2-3 horas

**Tareas propuestas:**
- [ ] Implementar breadcrumbs con Schema.org BreadcrumbList
  - Útil si se añaden más páginas en el futuro
  - Ubicación: componentes de navegación

- [ ] Añadir FAQ Schema para sección de preguntas frecuentes
  - Mejora posibilidad de aparecer en rich snippets de Google
  - Ubicación: `src/app/components/faq/faq.component.ts`
  - Referencia: https://schema.org/FAQPage

- [ ] Optimizar imagen social-card.png
  - Comprimir sin pérdida de calidad
  - Actual: verificar tamaño en `src/assets/images/social-card.png`
  - Herramientas: TinyPNG, ImageOptim, Squoosh

- [ ] Registrar en Bing Webmaster Tools
  - URL: https://www.bing.com/webmasters
  - Importar datos desde Google Search Console

**Documentación:**
- [ ] Actualizar `docs/reference/estado-seo.md` al completar cada item

---

### 🎨 UX/UI - Mejoras visuales
**Estado:** Backlog  
**Estimación:** Variable

**Tareas propuestas:**
- [ ] Añadir animaciones de scroll reveal
  - Secciones aparecen con fade-in al hacer scroll
  - Librería sugerida: AOS (Animate On Scroll)

- [ ] Mejorar loading state mientras carga precios desde Firestore
  - Skeleton screens o spinner
  - Ubicación: `src/app/components/pricing/pricing.component.html`

- [ ] Añadir página 404 personalizada
  - Diseño consistente con el resto del sitio
  - Sugerencias de navegación

**Documentación:**
- [ ] Documentar decisiones de UX en `docs/reference/ux-decisions.md` (crear)

---

## 🟢 Prioridad Baja

### 🧪 Testing - Ampliar cobertura
**Estado:** Opcional  
**Estimación:** 4-6 horas

**Tareas:**
- [ ] Aumentar tests E2E con Playwright
  - Verificar formularios de reserva
  - Probar cambio de temas en todos los navegadores
  - Ver: `docs/reference/testing-gaps-ui.md`

- [ ] Añadir tests unitarios para servicios
  - PricesService
  - LanguageService
  - ThemeService

- [ ] Configurar CI/CD con tests automáticos
  - Ejecutar tests en cada PR
  - Bloquear merge si fallan tests

**Documentación:**
- [ ] Actualizar `docs/reference/testing-gaps-ui.md` con progreso

---

### 📱 PWA - Progressive Web App
**Estado:** Backlog  
**Estimación:** 3-5 horas

**Tareas:**
- [ ] Configurar Service Worker para funcionamiento offline
- [ ] Añadir manifest.json completo para instalación
- [ ] Implementar estrategias de caché
- [ ] Probar instalación en móviles

**Beneficios:**
- App instalable desde el navegador
- Funcionamiento offline básico
- Mejora en Lighthouse (PWA score)

**Documentación:**
- [ ] Crear `docs/how-to/configurar-pwa.md`

---

### 🌍 i18n - Mejoras multi-idioma
**Estado:** Backlog  
**Estimación:** 2-3 horas

**Tareas propuestas:**
- [ ] Implementar URLs separadas por idioma
  - `/es/`, `/en/`, `/fr/`, etc.
  - Requiere cambios en routing y configuración de servidor
  - Ver: `docs/reference/seo-multi-idioma-opcion-a.md`

- [ ] Detección automática de idioma del navegador
  - Al entrar por primera vez, detectar `navigator.language`
  - Redirigir al idioma correspondiente si está soportado

- [ ] Añadir más idiomas
  - Chino (zh)
  - Japonés (ja)
  - Árabe (ar)

**Documentación:**
- [ ] Actualizar `docs/how-to/dar-alta-idioma.md` si se añaden idiomas

---

## 📚 Documentación Pendiente

### Guías por crear
- [ ] `docs/how-to/gestionar-vulnerabilidades.md`
  - Procedimiento para revisar y actualizar dependencias
  - Cuándo usar `npm audit fix` vs `npm audit fix --force`

- [ ] `docs/reference/angular-21-migration.md`
  - Crear tras completar migración a Angular 21
  - Documentar breaking changes encontrados

- [ ] `docs/how-to/configurar-analytics.md`
  - Documentar configuración de Google Analytics 4
  - Eventos personalizados implementados

- [ ] `docs/reference/firestore-structure.md`
  - Estructura de documentos en Firestore
  - Cómo actualizar precios

### Guías por actualizar
- [ ] `docs/reference/estado-seo.md`
  - Marcar todas las tareas de prioridad alta como completadas tras validación

---

## 🔄 Tareas Recurrentes

### Mensual
- [ ] Revisar vulnerabilidades: `npm audit`
- [ ] Actualizar dependencias menores: `npm update`
- [ ] Revisar métricas SEO en Google Search Console
- [ ] Análisis de tráfico en Google Analytics

### Trimestral
- [ ] Ejecutar análisis completo con Lighthouse
- [ ] Revisar y actualizar keywords SEO
- [ ] Auditoría de accesibilidad (WCAG)
- [ ] Backup de datos de Firestore

### Anual
- [ ] Actualizar versiones mayores de Angular
- [ ] Renovar certificados SSL (si aplica)
- [ ] Revisar competencia y ajustar estrategia SEO

---

## ✅ Recientemente Completado

### Enero 2026 - Optimización SEO
- [x] JSON-LD Schema.org LocalBusiness implementado
- [x] Hreflang tags para 7 idiomas
- [x] Coordenadas GPS exactas actualizadas
- [x] Datos de contacto reales (teléfono, dirección)
- [x] URLs de redes sociales (Instagram, Facebook, TikTok)
- [x] Meta tags geo-targeting
- [x] Sitemap XML mejorado
- [x] Documentación completa creada
- [x] Puntuación Lighthouse SEO: 100/100

Ver detalles en: `docs/reference/plan-accion-seo-2026-01.md`

---

## 📝 Notas

### Comandos útiles
```bash
# Verificar vulnerabilidades
npm audit

# Corregir vulnerabilidades sin breaking changes
npm audit fix

# Corregir todas (CUIDADO: breaking changes)
npm audit fix --force

# Actualizar dependencias menores
npm update

# Ver paquetes desactualizados
npm outdated

# Ejecutar tests
npm test

# Build de producción
npm run build

# Análisis SEO local
lighthouse http://localhost:4200 --only-categories=seo
```

### Enlaces importantes
- [GitHub Repo](https://github.com/FinderLost/easy-locker-web)
- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com/)
- [Firebase Console](https://console.firebase.google.com/)

---

**Mantenimiento de este archivo:**
- Actualizar al completar cada tarea
- Añadir nuevas tareas según surjan
- Mover tareas completadas a la sección "Recientemente Completado"
- Revisar prioridades mensualmente
