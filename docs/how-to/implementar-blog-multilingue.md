---
title: Implementar Blog Multilingüe - Guía Completa
description: Plan integral de implementación del blog de contenido de valor sobre Córdoba y turismo, con arquitectura multilingüe, SEO y gestión de contenido.
tags: [blog, content, seo, i18n, feature]
owner: web-team
last_updated: 2026-02-03
status: approved
llm_summary: Planificación completa del sistema de blog multilingüe para Easy Locker con arquitectura, SEO, rutas, gestión de contenido y estrategia editorial.
---

# Implementar Blog Multilingüe - Guía Completa

## 🎯 Objetivo estratégico

Crear un blog multilingüe con contenido de valor sobre Córdoba y turismo para:
- **SEO**: Atraer tráfico orgánico de long-tail keywords
- **Autoridad**: Posicionarse como expertos en turismo en Córdoba
- **Enlaces naturales**: Generar backlinks desde sitios de viajes
- **Conversión**: Contenido relevante que conduce a reservas de taquillas

---

## 📋 Índice

1. [Análisis y contexto del proyecto](#1-análisis-y-contexto-del-proyecto)
2. [Arquitectura técnica](#2-arquitectura-técnica)
3. [Sistema de rutas y SEO](#3-sistema-de-rutas-y-seo)
4. [Gestión de contenido](#4-gestión-de-contenido)
5. [Diseño y componentes](#5-diseño-y-componentes)
6. [Internacionalización (i18n)](#6-internacionalización-i18n)
7. [Plan de implementación por fases](#7-plan-de-implementación-por-fases)
8. [Estrategia editorial](#8-estrategia-editorial)
9. [Checklist de verificación](#9-checklist-de-verificación)

---

## 1. Análisis y contexto del proyecto

### 1.1 Situación actual

**Arquitectura existente:**
- Angular 16.2.0 con routing modular
- Sistema i18n con ngx-translate (7 idiomas: es, en, fr, de, it, ja, ko)
- Rutas actuales: `/:lang` (Home) y `/politica-cookies` (Cookie Policy)
- SEO gestionado dinámicamente en `app.component.ts`
- Sistema de protección SEO con tests E2E y CI/CD
- Schema.org LocalBusiness + Organization implementado

**Público objetivo del blog:**
- Turistas internacionales (25-45 años)
- Búsquedas: "qué ver en Córdoba", "dónde guardar maletas Córdoba", "guía turística Córdoba"
- Dispositivos: 80% móvil, 20% desktop
- Idiomas prioritarios: ES, EN, FR, DE (luego IT, JA, KO)

**Restricciones críticas:**
- ❌ NO modificar URLs existentes sin redirect 301 ([normas-criticas-seo.md](../reference/normas-criticas-seo.md))
- ❌ NO cambiar title/description sin validar longitud ([cambios-seo-seguros.md](cambios-seo-seguros.md))
- ✅ Mantener patrón de canónica única (`https://easy-locker.com/`)
- ✅ Seguir estructura i18n existente (prefijo `/:lang`)
- ✅ Verificar compilación pre-entrega ([verificacion-pre-entrega.md](verificacion-pre-entrega.md))

### 1.2 Decisiones arquitectónicas previas a respetar

| Decisión | Razón | Documentación |
|----------|-------|---------------|
| Canónica única | Evitar competencia interna entre idiomas | [i18n-estado-actual.md](../reference/i18n-estado-actual.md) |
| @graph JSON-LD | Múltiples schemas relacionados (mejor práctica 2024+) | [CHANGELOG-AGENT.md](../meta/CHANGELOG-AGENT.md) |
| business-info.json | Single source of truth para datos del negocio | [CHANGELOG-AGENT.md](../meta/CHANGELOG-AGENT.md) |
| Versionado semántico | Footer display automático desde package.json | [guia-versionado.md](../reference/guia-versionado.md) |

---

## 2. Arquitectura técnica

### 2.1 Módulo Blog (lazy loading)

**Justificación:**
- Blog es funcionalidad secundaria → lazy loading para optimizar bundle
- Permite escalabilidad: añadir categorías, tags, búsqueda sin afectar Home
- Aislamiento: Tests y mantenimiento independientes

**Estructura de archivos:**
```
src/app/pages/blog/
├── blog-routing.module.ts
├── blog.module.ts
├── components/
│   ├── blog-list/
│   │   ├── blog-list.component.ts
│   │   ├── blog-list.component.html
│   │   ├── blog-list.component.css
│   │   └── blog-list.component.spec.ts
│   ├── blog-post/
│   │   ├── blog-post.component.ts
│   │   ├── blog-post.component.html
│   │   ├── blog-post.component.css
│   │   └── blog-post.component.spec.ts
│   ├── blog-card/
│   │   ├── blog-card.component.ts
│   │   ├── blog-card.component.html
│   │   └── blog-card.component.css
│   ├── blog-category-filter/
│   │   ├── blog-category-filter.component.ts
│   │   ├── blog-category-filter.component.html
│   │   └── blog-category-filter.component.css
│   └── blog-related-posts/
│       ├── blog-related-posts.component.ts
│       ├── blog-related-posts.component.html
│       └── blog-related-posts.component.css
├── services/
│   ├── blog.service.ts
│   └── blog.service.spec.ts
└── models/
    └── blog-post.model.ts
```

### 2.2 Modelo de datos

**Interface `BlogPost`:**
```typescript
export interface BlogPost {
  // Identificación
  id: string;                    // Slug único (ej: "mezquita-catedral-cordoba")
  
  // Contenido multilingüe
  title: Record<Language, string>;           // "Visita a la Mezquita-Catedral de Córdoba"
  slug: Record<Language, string>;            // "mezquita-catedral-cordoba" (URL-friendly)
  excerpt: Record<Language, string>;         // Resumen corto (150-160 chars SEO)
  content: Record<Language, string>;         // Contenido HTML completo
  
  // SEO
  metaTitle: Record<Language, string>;       // 50-60 caracteres
  metaDescription: Record<Language, string>; // 120-160 caracteres
  keywords: Record<Language, string[]>;      // ["mezquita córdoba", "turismo córdoba"]
  
  // Taxonomía
  category: BlogCategory;                    // "guias-turisticas" | "consejos-viaje" | ...
  tags: string[];                            // ["monumentos", "unesco", "historia"]
  
  // Metadatos
  author: string;                            // "Easy Locker Team"
  publishedAt: Date;                         // Fecha publicación
  updatedAt: Date;                           // Última modificación
  readingTimeMinutes: number;                // 5, 10, 15... minutos
  
  // Media
  featuredImage: {
    url: string;                             // "/assets/images/blog/mezquita-cordoba.jpg"
    alt: Record<Language, string>;           // Alt text multilingüe
    width: number;                           // 1200
    height: number;                          // 630
    credit?: string;                         // "Foto: Turismo Córdoba"
  };
  
  // Relacionados
  relatedPosts?: string[];                   // IDs de posts relacionados
  
  // Control
  status: 'draft' | 'published' | 'archived';
  featured: boolean;                         // Destacado en home o listado
}

export type Language = 'es' | 'en' | 'fr' | 'de' | 'it' | 'ja' | 'ko';

export type BlogCategory = 
  | 'guias-turisticas'        // Guías de monumentos y lugares
  | 'consejos-viaje'          // Tips prácticos para turistas
  | 'eventos-cordoba'         // Festivales, eventos temporales
  | 'gastronomia'             // Restaurantes, tapas, bares
  | 'historia-cultura';       // Historia, anécdotas culturales
```

### 2.3 Servicio Blog

**Responsabilidades:**
```typescript
@Injectable({ providedIn: 'root' })
export class BlogService {
  
  // Obtener todos los posts (con filtros opcionales)
  getPosts(filters?: {
    category?: BlogCategory;
    tag?: string;
    lang?: Language;
    featured?: boolean;
    limit?: number;
  }): Observable<BlogPost[]>;
  
  // Obtener un post por slug e idioma
  getPostBySlug(slug: string, lang: Language): Observable<BlogPost>;
  
  // Obtener posts relacionados
  getRelatedPosts(postId: string, limit: number): Observable<BlogPost[]>;
  
  // Obtener categorías disponibles
  getCategories(): BlogCategory[];
  
  // Calcular tiempo de lectura (palabras / 200 palabras por minuto)
  calculateReadingTime(content: string): number;
}
```

**Estrategia de datos:**
- **Fase 1 (MVP)**: JSON estático en `src/assets/data/blog-posts.json`
- **Fase 2 (escalabilidad)**: Firebase Firestore (mantiene patrón business-info.json)
- **Fase 3 (CMS)**: Integración con Headless CMS (Strapi, Contentful, Sanity)

---

## 3. Sistema de rutas y SEO

### 3.1 Estructura de URLs

**Patrón de rutas:**
```
/:lang/blog                          → Listado de artículos
/:lang/blog/:category                → Listado filtrado por categoría
/:lang/blog/articulo/:slug           → Post individual
```

**Ejemplos reales:**
```
/es/blog                             → Blog principal (español)
/es/blog/guias-turisticas            → Guías turísticas (español)
/es/blog/articulo/mezquita-catedral-cordoba → Post individual

/en/blog                             → Blog main (English)
/en/blog/travel-guides               → Travel guides (English)
/en/blog/article/mosque-cathedral-cordoba → Individual post
```

### 3.2 Configuración de routing

**`src/app/app-routing.module.ts`** (modificación):
```typescript
const routes: Routes = [
  { path: '', pathMatch: 'full', component: LanguageRedirectComponent },
  
  // Rutas existentes (cookie policy)
  { path: COOKIE_POLICY_SLUGS['es'], component: CookiePolicyComponent, ... },
  { path: COOKIE_POLICY_SLUGS['en'], component: CookiePolicyComponent, ... },
  // ... otros idiomas
  
  // 🆕 NUEVO: Blog con lazy loading
  {
    path: ':lang/blog',
    loadChildren: () => import('./pages/blog/blog.module').then(m => m.BlogModule),
    canActivate: [LanguageRouteGuard],
  },
  
  // Home (existente)
  {
    path: ':lang',
    component: HomeComponent,
    canActivate: [LanguageRouteGuard],
    pathMatch: 'full',
  },
  
  { path: '**', redirectTo: '' },
];
```

**`src/app/pages/blog/blog-routing.module.ts`** (nuevo):
```typescript
const routes: Routes = [
  {
    path: '',
    component: BlogListComponent,
    pathMatch: 'full',
    data: { seoType: 'blog-list' }
  },
  {
    path: ':category',
    component: BlogListComponent,
    data: { seoType: 'blog-category' }
  },
  {
    path: 'articulo/:slug', // 'article' para EN, 'article' para FR/DE, etc.
    component: BlogPostComponent,
    data: { seoType: 'blog-post' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule {}
```

### 3.3 SEO dinámico para blog

**Actualizar `app.component.ts`:**
```typescript
private updateSeo(): void {
  const currentRoute = this.router.url;
  
  if (currentRoute.includes('/blog/articulo/') || currentRoute.includes('/blog/article/')) {
    this.updateBlogPostSeo(currentRoute);
  } else if (currentRoute.includes('/blog')) {
    this.updateBlogListSeo(currentRoute);
  } else if (/* cookie policy */) {
    this.updateCookiePolicySeo(lang);
  } else {
    this.updateHomeSeo();
  }
}

private updateBlogPostSeo(route: string): void {
  const lang = this.languageService.getCurrentLanguage();
  const slug = this.extractSlugFromRoute(route);
  
  // Obtener post del servicio
  this.blogService.getPostBySlug(slug, lang).subscribe(post => {
    if (!post) return;
    
    // Title
    this.titleService.setTitle(post.metaTitle[lang]);
    
    // Meta tags
    this.metaService.updateTag({ name: 'description', content: post.metaDescription[lang] });
    this.metaService.updateTag({ name: 'keywords', content: post.keywords[lang].join(', ') });
    this.metaService.updateTag({ name: 'author', content: post.author });
    this.metaService.updateTag({ property: 'article:published_time', content: post.publishedAt.toISOString() });
    this.metaService.updateTag({ property: 'article:modified_time', content: post.updatedAt.toISOString() });
    
    // Open Graph
    this.metaService.updateTag({ property: 'og:type', content: 'article' });
    this.metaService.updateTag({ property: 'og:title', content: post.metaTitle[lang] });
    this.metaService.updateTag({ property: 'og:description', content: post.metaDescription[lang] });
    this.metaService.updateTag({ property: 'og:image', content: `${this.baseUrl}${post.featuredImage.url}` });
    this.metaService.updateTag({ property: 'og:url', content: `${this.baseUrl}/${lang}/blog/articulo/${post.slug[lang]}` });
    
    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: post.metaTitle[lang] });
    this.metaService.updateTag({ name: 'twitter:description', content: post.metaDescription[lang] });
    this.metaService.updateTag({ name: 'twitter:image', content: `${this.baseUrl}${post.featuredImage.url}` });
    
    // Canonical
    this.updateCanonicalLink(`${this.baseUrl}/${lang}/blog/articulo/${post.slug[lang]}`);
    
    // JSON-LD Article Schema
    this.injectArticleSchema(post, lang);
  });
}

private injectArticleSchema(post: BlogPost, lang: Language): void {
  const existingScript = this.document.querySelector('script[data-schema="article"]');
  if (existingScript) {
    existingScript.remove();
  }
  
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title[lang],
    'description': post.excerpt[lang],
    'image': `${this.baseUrl}${post.featuredImage.url}`,
    'datePublished': post.publishedAt.toISOString(),
    'dateModified': post.updatedAt.toISOString(),
    'author': {
      '@type': 'Organization',
      'name': 'Easy Locker',
      'url': 'https://easy-locker.com'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Easy Locker',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://easy-locker.com/assets/images/logo.svg'
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${this.baseUrl}/${lang}/blog/articulo/${post.slug[lang]}`
    },
    'keywords': post.keywords[lang].join(', ')
  };
  
  const script = this.document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-schema', 'article');
  script.text = JSON.stringify(articleSchema);
  this.document.head.appendChild(script);
}
```

### 3.4 Sitemap actualización

**`src/sitemap.xml`** (añadir URLs del blog):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Existentes: Home y Cookie Policy -->
  <url>
    <loc>https://easy-locker.com/</loc>
    <lastmod>2026-01-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- 🆕 NUEVO: Blog principal -->
  <url>
    <loc>https://easy-locker.com/es/blog</loc>
    <lastmod>2026-02-03</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- 🆕 NUEVO: Posts individuales (generar dinámicamente) -->
  <url>
    <loc>https://easy-locker.com/es/blog/articulo/mezquita-catedral-cordoba</loc>
    <lastmod>2026-02-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- Repetir por cada post y idioma -->
</urlset>
```

**Automatización:**
- Script `scripts/generate-blog-sitemap.js` que lee `blog-posts.json` y genera entradas
- Ejecutar en CI/CD antes del deploy

---

## 4. Gestión de contenido

### 4.1 Estructura JSON estática (Fase 1 - MVP)

**`src/assets/data/blog-posts.json`:**
```json
{
  "posts": [
    {
      "id": "mezquita-catedral-cordoba",
      "title": {
        "es": "Guía completa: Visita la Mezquita-Catedral de Córdoba",
        "en": "Complete guide: Visit the Mosque-Cathedral of Córdoba",
        "fr": "Guide complet : Visitez la Mosquée-Cathédrale de Cordoue",
        "de": "Vollständiger Leitfaden: Besuchen Sie die Moschee-Kathedrale von Córdoba"
      },
      "slug": {
        "es": "mezquita-catedral-cordoba",
        "en": "mosque-cathedral-cordoba",
        "fr": "mosquee-cathedrale-cordoue",
        "de": "moschee-kathedrale-cordoba"
      },
      "excerpt": {
        "es": "Descubre la majestuosa Mezquita-Catedral de Córdoba, Patrimonio de la Humanidad. Historia, horarios, precios y consejos para aprovechar tu visita al máximo.",
        "en": "Discover the majestic Mosque-Cathedral of Córdoba, a UNESCO World Heritage Site. History, opening hours, prices, and tips to make the most of your visit."
      },
      "content": {
        "es": "<p>La Mezquita-Catedral de Córdoba es uno de los monumentos más impresionantes...</p>",
        "en": "<p>The Mosque-Cathedral of Córdoba is one of the most impressive monuments...</p>"
      },
      "metaTitle": {
        "es": "Visita la Mezquita-Catedral de Córdoba | Guía 2026",
        "en": "Visit the Mosque-Cathedral of Córdoba | 2026 Guide"
      },
      "metaDescription": {
        "es": "Guía completa para visitar la Mezquita-Catedral de Córdoba: horarios, precios, historia y consejos prácticos. Patrimonio de la Humanidad UNESCO.",
        "en": "Complete guide to visit the Mosque-Cathedral of Córdoba: opening hours, prices, history and practical tips. UNESCO World Heritage Site."
      },
      "keywords": {
        "es": ["mezquita córdoba", "catedral córdoba", "turismo córdoba", "patrimonio unesco córdoba", "monumentos córdoba"],
        "en": ["mosque cordoba", "cathedral cordoba", "tourism cordoba", "unesco heritage cordoba", "monuments cordoba"]
      },
      "category": "guias-turisticas",
      "tags": ["monumentos", "unesco", "historia", "arquitectura"],
      "author": "Easy Locker Team",
      "publishedAt": "2026-02-01T10:00:00Z",
      "updatedAt": "2026-02-01T10:00:00Z",
      "readingTimeMinutes": 8,
      "featuredImage": {
        "url": "/assets/images/blog/mezquita-catedral-cordoba.jpg",
        "alt": {
          "es": "Interior de la Mezquita-Catedral de Córdoba con columnas y arcos",
          "en": "Interior of the Mosque-Cathedral of Córdoba with columns and arches"
        },
        "width": 1200,
        "height": 630,
        "credit": "Foto: Turismo de Córdoba"
      },
      "relatedPosts": ["alcazar-reyes-cristianos", "juderia-cordoba"],
      "status": "published",
      "featured": true
    }
  ]
}
```

### 4.2 Script de validación

**`scripts/validate-blog-posts.js`:**
```javascript
const fs = require('fs');
const posts = JSON.parse(fs.readFileSync('src/assets/data/blog-posts.json', 'utf8'));

const LANGUAGES = ['es', 'en', 'fr', 'de', 'it', 'ja', 'ko'];
const REQUIRED_LANGS = ['es', 'en']; // Mínimo requerido

posts.posts.forEach((post, index) => {
  // Validar meta title length (50-60 chars)
  REQUIRED_LANGS.forEach(lang => {
    const titleLen = post.metaTitle[lang]?.length;
    if (!titleLen || titleLen < 50 || titleLen > 60) {
      console.error(`❌ Post ${post.id}: metaTitle[${lang}] debe tener 50-60 caracteres (actual: ${titleLen})`);
      process.exit(1);
    }
  });
  
  // Validar meta description length (120-160 chars)
  REQUIRED_LANGS.forEach(lang => {
    const descLen = post.metaDescription[lang]?.length;
    if (!descLen || descLen < 120 || descLen > 160) {
      console.error(`❌ Post ${post.id}: metaDescription[${lang}] debe tener 120-160 caracteres (actual: ${descLen})`);
      process.exit(1);
    }
  });
  
  // Validar slug único
  const slugs = posts.posts.map(p => p.slug.es);
  const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (duplicates.length > 0) {
    console.error(`❌ Slugs duplicados: ${duplicates.join(', ')}`);
    process.exit(1);
  }
  
  // Validar featured image
  if (!post.featuredImage?.url || !fs.existsSync(`src${post.featuredImage.url}`)) {
    console.error(`❌ Post ${post.id}: featuredImage no existe en ${post.featuredImage?.url}`);
    process.exit(1);
  }
});

console.log('✅ Todos los posts son válidos');
```

**Integrar en `package.json`:**
```json
{
  "scripts": {
    "blog:validate": "node scripts/validate-blog-posts.js",
    "blog:sitemap": "node scripts/generate-blog-sitemap.js",
    "prebuild": "npm run blog:validate && npm run seo:check"
  }
}
```

### 4.3 Workflow de contenido

**Proceso de creación:**
1. Editor escribe contenido en Markdown/Google Docs
2. Convertir a HTML limpio (herramienta: Pandoc, Marked)
3. Añadir entrada en `blog-posts.json` con todos los idiomas
4. Añadir imagen featured en `src/assets/images/blog/`
5. Ejecutar `npm run blog:validate`
6. Commit y PR a `develop`
7. CI/CD ejecuta tests E2E de SEO blog
8. Merge y deploy

**Responsabilidades:**
- **Contenido ES**: Equipo interno o copywriter
- **Traducciones**: DeepL API + revisión humana
- **Imágenes**: Banco de imágenes libres (Unsplash, Pexels) o propias
- **SEO review**: Validar keywords en Google Keyword Planner

---

## 5. Diseño y componentes

### 5.1 Blog List Component

**Características:**
- Diseño tipo magazine: Grid responsivo (1 col mobile, 2 cols tablet, 3 cols desktop)
- Filtros: Categorías en tabs horizontales + búsqueda (Fase 2)
- Paginación: 12 posts por página (Fase 2, usar query params `?page=2`)
- Loading states: Skeleton loaders mientras carga
- Empty state: Mensaje cuando no hay posts en categoría

**Tailwind classes a usar:**
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <app-blog-card 
    *ngFor="let post of posts$ | async; trackBy: trackByPostId"
    [post]="post">
  </app-blog-card>
</div>
```

### 5.2 Blog Card Component

**Información a mostrar:**
- Imagen featured (aspect ratio 16:9, lazy loading)
- Categoría (badge con color según categoría)
- Título (max 2 líneas, truncate)
- Excerpt (max 3 líneas, truncate)
- Metadata: Fecha publicación + Tiempo de lectura
- Hover effect: Elevación sombra + escala imagen

**Ejemplo visual:**
```
┌─────────────────────────────────┐
│  [Imagen 16:9 lazy]             │
│                                 │
├─────────────────────────────────┤
│ 🏛️ Guías turísticas            │
│                                 │
│ Visita la Mezquita-Catedral     │
│ de Córdoba                      │
│                                 │
│ Descubre la majestuosa          │
│ Mezquita-Catedral, Patrimonio   │
│ de la Humanidad...              │
│                                 │
│ 📅 1 Feb 2026  |  ⏱️ 8 min      │
└─────────────────────────────────┘
```

### 5.3 Blog Post Component

**Estructura del post:**
```html
<article class="max-w-3xl mx-auto px-4 py-12">
  <!-- Breadcrumb -->
  <nav class="mb-6 text-sm text-brand-textMuted">
    <a [routerLink]="['/', lang]">Home</a> / 
    <a [routerLink]="['/', lang, 'blog']">Blog</a> / 
    <span>{{ post.title[lang] }}</span>
  </nav>
  
  <!-- Header -->
  <header class="mb-8">
    <!-- Categoría -->
    <span class="inline-block px-3 py-1 text-xs font-semibold uppercase 
                 tracking-wide bg-brand-primary text-white rounded-full mb-4">
      {{ getCategoryLabel(post.category) }}
    </span>
    
    <!-- Título H1 -->
    <h1 class="text-4xl md:text-5xl font-bold text-brand-textPrimary mb-4">
      {{ post.title[lang] }}
    </h1>
    
    <!-- Metadata -->
    <div class="flex items-center gap-4 text-sm text-brand-textMuted">
      <span>{{ post.publishedAt | date: 'mediumDate' }}</span>
      <span>•</span>
      <span>{{ post.readingTimeMinutes }} min lectura</span>
      <span>•</span>
      <span>{{ post.author }}</span>
    </div>
  </header>
  
  <!-- Featured Image -->
  <figure class="mb-8">
    <img 
      [src]="post.featuredImage.url" 
      [alt]="post.featuredImage.alt[lang]"
      class="w-full h-auto rounded-lg shadow-lg"
      width="1200"
      height="630"
    />
    <figcaption *ngIf="post.featuredImage.credit" 
                class="mt-2 text-xs text-brand-textMuted text-right">
      {{ post.featuredImage.credit }}
    </figcaption>
  </figure>
  
  <!-- Contenido -->
  <div class="prose prose-lg max-w-none text-brand-textSecondary"
       [innerHTML]="post.content[lang] | safeHtml">
  </div>
  
  <!-- Tags -->
  <div class="mt-10 pt-6 border-t border-brand-border">
    <span class="text-sm font-semibold text-brand-textMuted mr-2">Tags:</span>
    <span *ngFor="let tag of post.tags" 
          class="inline-block px-2 py-1 text-xs text-brand-textSecondary 
                 bg-brand-cardBg rounded mr-2 mb-2">
      #{{ tag }}
    </span>
  </div>
  
  <!-- CTA reserva -->
  <div class="mt-10 p-6 bg-brand-primary/10 border border-brand-primary rounded-lg">
    <h3 class="text-xl font-bold text-brand-textPrimary mb-2">
      {{ 'blog.cta.title' | translate }}
    </h3>
    <p class="text-brand-textSecondary mb-4">
      {{ 'blog.cta.description' | translate }}
    </p>
    <button (click)="onReserveClick()" 
            class="px-6 py-3 bg-brand-primary text-white rounded-full 
                   font-semibold hover:bg-brand-primaryHover transition-colors">
      {{ 'blog.cta.button' | translate }}
    </button>
  </div>
  
  <!-- Related Posts -->
  <app-blog-related-posts [postIds]="post.relatedPosts" [lang]="lang">
  </app-blog-related-posts>
</article>
```

**Estilos de prosa (Tailwind Typography):**
```bash
npm install -D @tailwindcss/typography
```

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/typography'),
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--color-text-secondary)',
            a: {
              color: 'var(--color-primary)',
              '&:hover': {
                color: 'var(--color-primary-hover)',
              },
            },
            h2: {
              color: 'var(--color-text-primary)',
            },
            h3: {
              color: 'var(--color-text-primary)',
            },
            // ... más estilos
          },
        },
      },
    },
  },
};
```

---

## 6. Internacionalización (i18n)

### 6.1 Claves de traducción nuevas

**`src/assets/i18n/es.json`** (añadir):
```json
{
  "blog": {
    "list": {
      "title": "Blog de viajes y turismo en Córdoba",
      "subtitle": "Guías, consejos y recomendaciones para disfrutar de Córdoba",
      "emptyState": "No hay artículos en esta categoría todavía.",
      "loadMore": "Cargar más artículos",
      "categories": {
        "all": "Todos",
        "guias-turisticas": "Guías turísticas",
        "consejos-viaje": "Consejos de viaje",
        "eventos-cordoba": "Eventos en Córdoba",
        "gastronomia": "Gastronomía",
        "historia-cultura": "Historia y cultura"
      }
    },
    "post": {
      "readMore": "Leer más",
      "share": "Compartir",
      "relatedPosts": "Artículos relacionados",
      "backToBlog": "Volver al blog"
    },
    "cta": {
      "title": "¿Listo para explorar Córdoba?",
      "description": "Guarda tus maletas con Easy Locker y disfruta de la ciudad sin cargas. Reserva tu taquilla ahora y recibe un código de acceso al instante.",
      "button": "Reservar ahora"
    },
    "seo": {
      "list": {
        "title": "Blog de turismo en Córdoba | Easy Locker",
        "description": "Descubre guías de viaje, consejos prácticos y recomendaciones para disfrutar al máximo de Córdoba. Información actualizada sobre monumentos, gastronomía y eventos."
      }
    },
    "metadata": {
      "publishedOn": "Publicado el",
      "readingTime": "min de lectura",
      "author": "Autor"
    }
  }
}
```

**Traducciones requeridas:**
- Mínimo: ES, EN (priorizados)
- Recomendado: FR, DE (turismo europeo importante)
- Opcional: IT, JA, KO (menor tráfico pero completa experiencia)

### 6.2 Gestión de traducciones

**Herramientas:**
- **DeepL API**: Traducción automática de calidad (mejor que Google Translate para ES↔EN/FR/DE)
- **Revisión humana**: Validar traducciones automáticas antes de publicar
- **Translation Memory**: Mantener glosario de términos recurrentes (monumentos, platos típicos)

**Script de traducción automática:**
```javascript
// scripts/translate-blog-post.js
const deepl = require('deepl-node');
const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

async function translatePost(postId, sourceLang = 'es', targetLangs = ['en', 'fr', 'de']) {
  const post = getPostById(postId);
  
  for (const targetLang of targetLangs) {
    // Traducir título
    post.title[targetLang] = await translator.translateText(
      post.title[sourceLang], 
      sourceLang, 
      targetLang
    );
    
    // Traducir contenido (dividir en párrafos para respetar límites API)
    // ... implementación completa
  }
  
  savePost(post);
}
```

---

## 7. Plan de implementación por fases

### Fase 1: MVP - Infraestructura básica (Sprint 1-2, ~2 semanas)

**Objetivos:**
- ✅ Módulo blog funcional con lazy loading
- ✅ Listado de posts (sin filtros ni paginación)
- ✅ Vista de post individual con SEO completo
- ✅ 3-5 posts de ejemplo en ES/EN
- ✅ Tests E2E básicos

**Tareas:**
1. Crear estructura de archivos del módulo blog
2. Implementar `BlogService` con JSON estático
3. Diseñar y maquetar `BlogListComponent` y `BlogPostComponent`
4. Configurar routing con lazy loading
5. Actualizar `app.component.ts` con SEO dinámico para blog
6. Crear 3 posts de ejemplo (Mezquita, Alcázar, Judería)
7. Añadir tests E2E para:
   - Navegación a `/es/blog`
   - Carga de post individual
   - Validación de meta tags (title, description)
   - Schema.org Article
8. Actualizar sitemap.xml
9. Documentar en `docs/how-to/crear-post-blog.md`

**Entregables:**
- PR a `develop` con funcionalidad completa
- Build exitoso (`npm run build`)
- Tests E2E pasando (25+ blog, 25+ existentes)
- Documentación actualizada

**Criterios de aceptación:**
- [ ] URL `/es/blog` carga listado con 3 posts
- [ ] Click en post abre vista individual
- [ ] Meta title y description correctos (50-60 y 120-160 chars)
- [ ] JSON-LD Article Schema presente en posts
- [ ] Responsive: Mobile (1 col), Desktop (3 cols)
- [ ] Lazy loading de imágenes activo
- [ ] No hay errores de compilación ni warnings críticos

---

### Fase 2: Funcionalidad avanzada (Sprint 3-4, ~2 semanas)

**Objetivos:**
- ✅ Filtros por categoría
- ✅ Búsqueda de posts (título, excerpt, tags)
- ✅ Paginación (12 posts/página)
- ✅ Related posts al final de cada post
- ✅ 10-15 posts totales en ES/EN/FR/DE

**Tareas:**
1. Implementar `BlogCategoryFilterComponent`
2. Añadir búsqueda con debounce (RxJS operators)
3. Implementar paginación con query params (`?page=2`)
4. Crear `BlogRelatedPostsComponent`
5. Optimizar BlogService con caché (RxJS `shareReplay`)
6. Escribir 7-10 posts adicionales:
   - "Dónde comer en Córdoba: Mejores tabernas y bares"
   - "Patios de Córdoba: Festival y mejores lugares"
   - "Ruta del Califato: De Córdoba a Granada"
   - "Qué hacer en Córdoba con niños"
   - "Córdoba en primavera: Festival de los Patios"
   - "Puente Romano y Torre de la Calahorra"
   - "Medina Azahara: La ciudad califal"
7. Actualizar tests E2E para filtros y paginación
8. Añadir Analytics events (blog_view, article_read)

**Entregables:**
- PR con funcionalidades avanzadas
- 10-15 posts en 4 idiomas (ES, EN, FR, DE)
- Tests E2E actualizados
- Documentación de Analytics

**Criterios de aceptación:**
- [ ] Filtros de categoría funcionan correctamente
- [ ] Búsqueda encuentra posts por título/excerpt/tags
- [ ] Paginación persiste filtros en URL
- [ ] Related posts relevantes al final de cada post
- [ ] Analytics eventos disparan correctamente

---

### Fase 3: Optimización y escalabilidad (Sprint 5-6, ~2 semanas)

**Objetivos:**
- ✅ Migración a Firebase Firestore (opcional)
- ✅ Script automatizado de sitemap blog
- ✅ Integración con Google Search Console
- ✅ Performance optimization (Core Web Vitals)
- ✅ A/B testing de CTAs (reserva desde blog)

**Tareas:**
1. Evaluar migración a Firestore vs JSON estático
2. Si Firestore: Implementar `BlogFirestoreService`
3. Crear script `scripts/generate-blog-sitemap.js`
4. Automatizar sitemap generation en CI/CD
5. Optimizar imágenes blog (WebP, srcset responsive)
6. Lazy load de componentes relacionados
7. Preload de next page en paginación
8. Implementar A/B test framework (simple flag en Analytics)
9. Crear 20+ posts para cubrir long-tail keywords

**Entregables:**
- Sistema de gestión de contenido escalable
- 20+ posts en múltiples idiomas
- Performance: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Sitemap automático generado
- A/B test framework activo

**Criterios de aceptación:**
- [ ] Firestore integrado (o JSON optimizado con caché)
- [ ] Sitemap se regenera automáticamente en deploy
- [ ] Core Web Vitals en rango "Good" (Google PageSpeed)
- [ ] CTAs en blog generan conversiones (Analytics tracking)
- [ ] Blog aparece en Google Search Console sin errores

---

### Fase 4: Content Marketing y crecimiento (Ongoing)

**Objetivos:**
- ✅ Publicar 2-4 posts/mes de forma consistente
- ✅ Estrategia de backlinks (guest posting, partnerships)
- ✅ Newsletter opcional (captura email al final de posts)
- ✅ Social media automation (compartir posts en redes)

**Tareas:**
1. Calendario editorial mensual
2. Investigación de keywords (Google Keyword Planner, Ahrefs)
3. Outreach a blogs de viajes para backlinks
4. Implementar newsletter signup (integración Mailchimp/Brevo)
5. Automatizar social sharing (Buffer, Hootsuite)
6. Monitorizar rankings en Google Search Console
7. Actualizar posts antiguos con información nueva

**KPIs a trackear:**
- Tráfico orgánico al blog (Google Analytics)
- Posiciones en SERPs para keywords objetivo
- Conversión blog → reservas (funnel)
- Tiempo de permanencia en posts
- Backlinks obtenidos

---

## 8. Estrategia editorial

### 8.1 Pilares de contenido

| Pilar | Objetivo | Ejemplos de posts | Keywords objetivo |
|-------|----------|-------------------|-------------------|
| **Guías turísticas** | Posicionar en búsquedas de monumentos/lugares | "Visita la Mezquita", "Alcázar de los Reyes Cristianos", "Judería de Córdoba" | "mezquita córdoba horarios", "alcázar córdoba precio" |
| **Consejos prácticos** | Long-tail keywords de intención | "Dónde guardar maletas Córdoba", "Qué hacer con niños", "Córdoba en un día" | "consigna equipaje córdoba", "dónde dejar maletas córdoba" |
| **Gastronomía** | Atraer turistas foodies | "Mejores tabernas Córdoba", "Ruta del salmorejo", "Dónde comer barato" | "restaurantes córdoba", "tabernas córdoba centro" |
| **Eventos** | Estacionalidad y tendencias | "Festival de los Patios", "Cruces de Mayo", "Semana Santa Córdoba" | "patios córdoba 2026", "semana santa córdoba horarios" |
| **Historia y cultura** | Autoridad y contenido evergreen | "Historia de la Mezquita", "Califato de Córdoba", "Ruta del Califato" | "historia mezquita córdoba", "califato córdoba" |

### 8.2 Calendario editorial (ejemplo Q1 2026)

| Mes | Semana | Post | Categoría | Idiomas | Keywords objetivo |
|-----|--------|------|-----------|---------|-------------------|
| Feb | 1 | Visita la Mezquita-Catedral | Guías turísticas | ES, EN, FR, DE | "mezquita córdoba", "mosque cordoba" |
| Feb | 2 | Dónde guardar maletas en Córdoba | Consejos prácticos | ES, EN | "consigna equipaje córdoba", "luggage storage cordoba" |
| Feb | 3 | Alcázar de los Reyes Cristianos | Guías turísticas | ES, EN, FR, DE | "alcázar córdoba", "alcazar cordoba" |
| Feb | 4 | Mejores tabernas y bares de Córdoba | Gastronomía | ES, EN | "tabernas córdoba", "tapas cordoba" |
| Mar | 1 | Festival de los Patios de Córdoba 2026 | Eventos | ES, EN, FR, DE | "patios córdoba 2026", "cordoba patios festival" |
| Mar | 2 | Judería de Córdoba: Qué ver | Guías turísticas | ES, EN, FR, DE | "judería córdoba", "jewish quarter cordoba" |
| Mar | 3 | Qué hacer en Córdoba con niños | Consejos prácticos | ES, EN | "córdoba con niños", "cordoba with kids" |
| Mar | 4 | Ruta del salmorejo cordobés | Gastronomía | ES, EN | "salmorejo córdoba", "salmorejo recipe" |

### 8.3 Optimización SEO de posts

**Checklist por post:**
- [ ] Keyword principal en título H1 (natural, no forzada)
- [ ] Keyword principal en los primeros 100 caracteres del contenido
- [ ] 3-5 keywords secundarias distribuidas naturalmente
- [ ] Headers H2 y H3 con keywords LSI (Latent Semantic Indexing)
- [ ] Enlaces internos a otros posts del blog (2-3 mínimo)
- [ ] Enlaces externos a fuentes autorizadas (Wikipedia, Turismo de Córdoba)
- [ ] Alt text descriptivo en todas las imágenes
- [ ] Contenido mínimo 800-1200 palabras (sweet spot SEO)
- [ ] CTA de conversión (reserva taquilla) en medio y final del post
- [ ] Meta description con keyword principal y CTA

**Ejemplo de estructura de post optimizada:**
```
[H1] Visita la Mezquita-Catedral de Córdoba: Guía completa 2026

[Intro con keyword] La Mezquita-Catedral de Córdoba es uno de los monumentos...

[H2] Historia de la Mezquita-Catedral
[Contenido 200-300 palabras]

[CTA] ¿Vas a visitar la Mezquita? Guarda tus maletas con Easy Locker...

[H2] Horarios y precios de entrada
[Contenido 150-200 palabras]

[H2] Cómo llegar a la Mezquita-Catedral
[Contenido 150 palabras]
[Link interno: "Dónde guardar maletas en Córdoba"]

[H2] Consejos para tu visita
[Contenido 200 palabras]

[CTA] Reserva tu taquilla ahora y explora Córdoba sin cargas...

[H2] Preguntas frecuentes
[H3] ¿Cuánto tiempo se tarda en visitar la Mezquita?
[H3] ¿Se puede entrar gratis a la Mezquita?
[H3] ¿Dónde puedo guardar mis maletas cerca de la Mezquita?

[Related posts] También te puede interesar: Alcázar, Judería, Patios...
```

---

## 9. Checklist de verificación

### 9.1 Pre-desarrollo

- [ ] Leer documentación completa ([docs/README.md](../README.md))
- [ ] Revisar memoria del agente ([CHANGELOG-AGENT.md](../meta/CHANGELOG-AGENT.md))
- [ ] Validar que rutas no conflictúan con existentes
- [ ] Confirmar idiomas a soportar en MVP (ES, EN mínimo)
- [ ] Preparar 3-5 posts de ejemplo con contenido real (no lorem ipsum)
- [ ] Conseguir imágenes de calidad (min 1200x630px)

### 9.2 Durante desarrollo

- [ ] Seguir patrón de componentes existentes (Tailwind, estructura)
- [ ] No modificar `app-routing.module.ts` sin tests de regresión
- [ ] Mantener SEO dinámico en `app.component.ts` (no duplicar lógica)
- [ ] Validar meta tags en cada commit (usar tests E2E)
- [ ] Compilar frecuentemente (`npm run build`)
- [ ] No commitear sin validar `npm run blog:validate`

### 9.3 Pre-merge

- [ ] `npm run build` exitoso (0 errores)
- [ ] `npm test` pasando (tests unitarios)
- [ ] `npx playwright test` pasando (tests E2E)
- [ ] `npm run blog:validate` pasando
- [ ] Validar manualmente en navegador:
  - [ ] Listado blog carga correctamente
  - [ ] Post individual muestra contenido completo
  - [ ] Meta tags correctos en inspector (DevTools)
  - [ ] JSON-LD Article Schema presente
  - [ ] Responsive (mobile, tablet, desktop)
  - [ ] Lazy loading de imágenes funciona
  - [ ] Navegación entre posts no rompe
- [ ] Actualizar documentación ([CHANGELOG-AGENT.md](../meta/CHANGELOG-AGENT.md))
- [ ] Screenshots en PR para review visual

### 9.4 Post-deploy

- [ ] Validar URLs del blog en producción (no 404)
- [ ] Verificar meta tags con herramientas:
  - [ ] Google Rich Results Test
  - [ ] Facebook Sharing Debugger
  - [ ] Twitter Card Validator
- [ ] Enviar sitemap actualizado a Google Search Console
- [ ] Monitorizar Analytics: `blog_view` events disparan
- [ ] Validar Core Web Vitals con PageSpeed Insights
- [ ] Añadir URLs del blog a Screaming Frog para auditoría completa
- [ ] Documentar issues encontrados en `docs/reference/testing-gaps-ui.md`

---

## 🔗 Ver también

- [Editar contenido (i18n)](editar-contenido.md)
- [Dar de alta un idioma](dar-alta-idioma.md)
- [Cambios SEO seguros](cambios-seo-seguros.md)
- [Ejecutar tests SEO](ejecutar-tests-seo.md)
- [Normas críticas SEO](../reference/normas-criticas-seo.md)
- [Estado actual i18n](../reference/i18n-estado-actual.md)
- [Propósito y target del proyecto](../reference/proposito-target.md)

---

## 📝 Notas finales

**Decisiones pendientes:**
1. ¿Firestore o JSON estático para MVP? (Recomendación: JSON → evaluar Firestore en Fase 3)
2. ¿Newsletter desde el inicio o Fase 4? (Recomendación: Fase 4, después de tener tráfico)
3. ¿Comentarios en posts? (Recomendación: NO, evitar moderación y spam)
4. ¿RSS feed?