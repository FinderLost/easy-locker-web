import { test, expect } from '@playwright/test';

/**
 * Tests E2E para validación de blog multilingüe
 * Verifica:
 * - Navegación a lista de blog
 * - Carga correcta de posts individuales
 * - Meta tags SEO dinámicos (title, description, og:*, twitter:*)
 * - JSON-LD Article schema
 * - Lazy loading de imágenes
 * - Grid responsivo (desktop: 3 cols, tablet: 2 cols, mobile: 1 col)
 * - CTA de reserva funcional
 */

test.describe('Blog - Navegación y contenido', () => {
  test('debe cargar la lista de blog en español', async ({ page }) => {
    await page.goto('/es/blog');
    await expect(page).toHaveTitle(/Blog/);
    
    // Verificar que se carguen las tarjetas de blog
    const blogCards = page.locator('app-blog-card');
    await expect(blogCards).toHaveCount(3);
  });

  test('debe cargar la lista de blog en inglés', async ({ page }) => {
    await page.goto('/en/blog');
    await expect(page).toHaveTitle(/Blog/);
    
    const blogCards = page.locator('app-blog-card');
    await expect(blogCards).toHaveCount(3);
  });

  test('debe navegar a un post individual desde ES', async ({ page }) => {
    await page.goto('/es/blog');
    
    // Click en la primera tarjeta
    await page.locator('app-blog-card').first().click();
    
    // Esperar navegación a post individual
    await page.waitForURL(/\/es\/blog\/articulo\/.+/);
    
    // Verificar que se cargó el contenido del post
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.blog-content')).toBeVisible();
  });

  test('debe mostrar breadcrumb correcto en post individual', async ({ page }) => {
    await page.goto('/es/blog/articulo/mezquita-catedral-cordoba');
    
    const breadcrumb = page.locator('nav').first();
    await expect(breadcrumb).toContainText('Home');
    await expect(breadcrumb).toContainText('Blog');
  });

  test('debe mostrar CTA de reserva en post individual', async ({ page }) => {
    await page.goto('/es/blog/articulo/mezquita-catedral-cordoba');
    
    const ctaSection = page.locator('.bg-brand-primary\\/10');
    await expect(ctaSection).toBeVisible();
    
    const ctaButton = page.locator('button').filter({ hasText: /reserva|book/i });
    await expect(ctaButton).toBeVisible();
  });
});

test.describe('Blog - SEO y Meta tags', () => {
  test('debe tener meta tags correctos en lista de blog ES', async ({ page }) => {
    await page.goto('/es/blog');
    
    // Title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(30);
    expect(title.length).toBeLessThan(70);
    
    // Meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(100);
    expect(metaDescription!.length).toBeLessThan(170);
  });

  test('debe tener meta tags dinámicos en post individual', async ({ page }) => {
    await page.goto('/es/blog/articulo/mezquita-catedral-cordoba');
    
    // Title específico del post
    const title = await page.title();
    expect(title).toContain('Mezquita');
    expect(title.length).toBeGreaterThan(40);
    expect(title.length).toBeLessThan(65);
    
    // Meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(110);
    expect(metaDescription!.length).toBeLessThan(165);
    
    // Open Graph
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toContain('Mezquita');
    
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    expect(ogType).toBe('article');
    
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBeTruthy();
    expect(ogImage).toMatch(/\.(jpg|jpeg|png|webp)$/);
    
    // Twitter Cards
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBe('summary_large_image');
    
    const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content');
    expect(twitterImage).toBeTruthy();
  });

  test('debe tener canonical URL correcto en post individual', async ({ page }) => {
    await page.goto('/es/blog/articulo/mezquita-catedral-cordoba');
    
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe('https://easy-locker.com/es/blog/articulo/mezquita-catedral-cordoba');
  });

  test('debe tener hreflang tags en post individual', async ({ page }) => {
    await page.goto('/es/blog/articulo/mezquita-catedral-cordoba');
    
    const hreflangEs = await page.locator('link[rel="alternate"][hreflang="es"]').getAttribute('href');
    expect(hreflangEs).toContain('/es/blog/articulo/');
    
    const hreflangEn = await page.locator('link[rel="alternate"][hreflang="en"]').getAttribute('href');
    expect(hreflangEn).toContain('/en/blog/article/');
    
    const hreflangDefault = await page.locator('link[rel="alternate"][hreflang="x-default"]').getAttribute('href');
    expect(hreflangDefault).toContain('/es/blog/articulo/');
  });
});

test.describe('Blog - JSON-LD Schema', () => {
  test('debe tener Article schema en post individual', async ({ page }) => {
    await page.goto('/es/blog/articulo/mezquita-catedral-cordoba');
    
    const jsonLdScript = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLdScript).toBeTruthy();
    
    const schema = JSON.parse(jsonLdScript!);
    expect(schema['@type']).toBe('Article');
    expect(schema.headline).toBeTruthy();
    expect(schema.description).toBeTruthy();
    expect(schema.image).toBeTruthy();
    expect(schema.author).toBeTruthy();
    expect(schema.author['@type']).toBe('Person');
    expect(schema.publisher).toBeTruthy();
    expect(schema.publisher['@type']).toBe('Organization');
    expect(schema.publisher.name).toBe('Easy Locker');
    expect(schema.datePublished).toBeTruthy();
    expect(schema.mainEntityOfPage).toBeTruthy();
  });

  test('debe tener Publisher logo en Article schema', async ({ page }) => {
    await page.goto('/es/blog/articulo/alcazar-reyes-cristianos');
    
    const jsonLdScript = await page.locator('script[type="application/ld+json"]').textContent();
    const schema = JSON.parse(jsonLdScript!);
    
    expect(schema.publisher.logo).toBeTruthy();
    expect(schema.publisher.logo['@type']).toBe('ImageObject');
    expect(schema.publisher.logo.url).toContain('logo.png');
  });
});

test.describe('Blog - Responsive Design', () => {
  test('debe mostrar 3 columnas en desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/es/blog');
    
    const grid = page.locator('.grid');
    const gridClasses = await grid.getAttribute('class');
    expect(gridClasses).toContain('md:grid-cols-3');
  });

  test('debe mostrar 1 columna en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/es/blog');
    
    const grid = page.locator('.grid');
    const gridClasses = await grid.getAttribute('class');
    expect(gridClasses).toContain('grid-cols-1');
  });

  test('debe tener lazy loading en imágenes', async ({ page }) => {
    await page.goto('/es/blog');
    
    const firstImage = page.locator('app-blog-card img').first();
    const loading = await firstImage.getAttribute('loading');
    expect(loading).toBe('lazy');
  });
});

test.describe('Blog - Internacionalización', () => {
  test('debe cambiar slugs entre ES y EN correctamente', async ({ page }) => {
    // Navegar a post en ES
    await page.goto('/es/blog/articulo/mezquita-catedral-cordoba');
    await expect(page).toHaveURL(/\/es\/blog\/articulo\//);
    
    // Navegar a post en EN usando hreflang
    await page.goto('/en/blog/article/mezquita-cathedral-cordoba');
    await expect(page).toHaveURL(/\/en\/blog\/article\//);
    
    // Verificar que el contenido cambió de idioma
    const title = await page.title();
    expect(title).not.toContain('Catedral'); // ES
  });

  test('debe mostrar contenido en inglés cuando se accede a /en/blog', async ({ page }) => {
    await page.goto('/en/blog');
    
    const title = await page.title();
    expect(title).toMatch(/Blog|Travel/i);
  });
});

test.describe('Blog - Funcionalidad CTA', () => {
  test('debe abrir enlace de reserva al hacer clic en CTA', async ({ page, context }) => {
    await page.goto('/es/blog/articulo/donde-guardar-maletas-cordoba');
    
    // Preparar para capturar nueva ventana
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('button').filter({ hasText: /reserva|book/i }).click()
    ]);
    
    // Verificar que se abrió URL de booking engine
    await newPage.waitForLoadState();
    const newUrl = newPage.url();
    expect(newUrl).toContain('easylocker.drop-point.com/booking-engine');
    expect(newUrl).toContain('locale=es');
    
    await newPage.close();
  });
});

test.describe('Blog - Navegación entre posts', () => {
  test('debe tener enlace de vuelta al blog', async ({ page }) => {
    await page.goto('/es/blog/articulo/mezquita-catedral-cordoba');
    
    const backLink = page.locator('a').filter({ hasText: /blog/i }).last();
    await expect(backLink).toBeVisible();
    
    await backLink.click();
    await page.waitForURL('/es/blog');
    await expect(page).toHaveURL('/es/blog');
  });
});
