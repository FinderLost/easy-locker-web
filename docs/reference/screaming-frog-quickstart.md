---
title: Guía rápida Screaming Frog
description: Referencia rápida para instalar y usar Screaming Frog SEO Spider en Easy Locker.
tags: [reference, seo, screaming-frog, quickstart]
owner: web-team
last_updated: 2026-01-22
status: approved
llm_summary: Comandos y pasos rápidos para análisis SEO con Screaming Frog, checklist de elementos implementados.
---

# 🔍 Guía rápida - Screaming Frog para Easy Locker

## ⚡ Instalación rápida

### macOS
```bash
# Descarga desde: https://www.screamingfrog.co.uk/seo-spider/
# O con Homebrew:
brew install --cask screaming-frog-seo-spider
```

### Windows/Linux
Descarga desde [screamingfrog.co.uk/seo-spider](https://www.screamingfrog.co.uk/seo-spider/)

---

## 🚀 Pasos para analizar Easy Locker

### 1. Levantar servidor local
```bash
npm start
# Servidor en: http://localhost:4200
```

### 2. Configurar Screaming Frog
1. Abre Screaming Frog SEO Spider
2. Ve a `Configuration > Spider > Rendering`
3. Activa: **JavaScript Rendering > JavaScript**
4. Ve a `Configuration > Spider > Basic`
5. Activa: **Crawl Images** y **Crawl JavaScript**

### 3. Ejecutar análisis
1. Ingresa en la barra: `http://localhost:4200`
2. Click en **Start**
3. Espera 1-5 minutos

### 4. Revisar resultados clave

| Pestaña | Qué revisar |
|---------|-------------|
| **Page Titles** | ✅ Títulos únicos, 50-60 caracteres |
| **Meta Description** | ✅ Descripciones únicas, 150-160 caracteres |
| **H1** | ✅ Un único H1 por página |
| **Images** | ✅ Todas con `alt` text |
| **Internal** | ❌ Sin enlaces rotos (404) |
| **Directives** | ✅ Canonical y hreflang correctos |
| **Structured Data** | ✅ JSON-LD válido |

---

## ✅ Checklist SEO implementado (22/01/2026)

### Meta tags
- [x] Title dinámico
- [x] Meta description
- [x] Meta keywords
- [x] Meta robots (index,follow)
- [x] Open Graph (og:title, og:description, og:image)
- [x] Twitter Card

### Multi-idioma
- [x] Hreflang tags (7 idiomas)
- [x] x-default tag
- [x] HTML lang dinámico

### Structured Data
- [x] JSON-LD Schema.org LocalBusiness
- [x] Dirección y coordenadas
- [x] Horarios 24/7

### Sitemap & Robots
- [x] sitemap.xml con lastmod
- [x] robots.txt optimizado

### Performance
- [x] Preconnect fonts
- [x] DNS prefetch APIs
- [x] Lazy loading imágenes

---

## 📊 Nivel actual: ⭐⭐⭐⭐⭐ (5/5)

---

## 📚 Documentación completa

Ver: [docs/how-to/analisis-seo-screaming-frog.md](docs/how-to/analisis-seo-screaming-frog.md)

Ver inventario: [docs/reference/estado-seo.md](docs/reference/estado-seo.md)
