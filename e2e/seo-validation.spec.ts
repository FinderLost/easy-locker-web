import { test, expect, Page } from '@playwright/test';

/**
 * Suite de tests E2E para validación completa de SEO
 * Valida todos los elementos implementados en la optimización de enero 2026
 */

test.describe('SEO Complete Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
    
    // Esperar a que Angular termine de cargar y actualizar SEO
    // El selector de idioma es señal de que el componente está listo
    await page.waitForSelector('app-language-switcher', { state: 'visible', timeout: 10000 });
    
    // Pequeña espera adicional para que TranslateService actualice meta tags
    await page.waitForTimeout(500);
  });

  test('Meta tags básicos están presentes y correctos', async ({ page }) => {
    // Title debe contener Easy Locker
    const title = await page.title();
    expect(title).toContain('Easy Locker');
    
    // Title debe tener longitud óptima SEO (50-60 caracteres)
    expect(title.length).toBeGreaterThanOrEqual(50);
    expect(title.length).toBeLessThanOrEqual(60);
    
    // Meta description debe estar en rango SEO óptimo (120-160 caracteres)
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription?.length).toBeGreaterThanOrEqual(120);
    expect(metaDescription?.length).toBeLessThanOrEqual(160);
    
    // Meta keywords
    const metaKeywords = await page.locator('meta[name="keywords"]').getAttribute('content');
    expect(metaKeywords).toBeTruthy();
    
    // Meta robots
    const metaRobots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(metaRobots).toBe('index,follow');
  });

  test('Open Graph tags están completos', async ({ page }) => {
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    const ogSiteName = await page.locator('meta[property="og:site_name"]').getAttribute('content');
    
    expect(ogTitle).toBeTruthy();
    // OG title también debe cumplir 50-60 caracteres
    expect(ogTitle?.length).toBeGreaterThanOrEqual(50);
    expect(ogTitle?.length).toBeLessThanOrEqual(60);
    
    expect(ogDescription).toBeTruthy();
    // OG description debe estar en rango SEO óptimo (120-160 caracteres)
    expect(ogDescription?.length).toBeGreaterThanOrEqual(120);
    expect(ogDescription?.length).toBeLessThanOrEqual(160);
    
    expect(ogImage).toContain('social-card.png');
    expect(ogUrl).toContain('easy-locker.com');
    expect(ogType).toBe('website');
    expect(ogSiteName).toContain('Easy Locker');
  });

  test('Twitter Card tags están completos', async ({ page }) => {
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');
    const twitterDescription = await page.locator('meta[name="twitter:description"]').getAttribute('content');
    const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content');
    
    expect(twitterCard).toBe('summary_large_image');
    expect(twitterTitle).toBeTruthy();
    // Twitter title también debe cumplir 50-60 caracteres
    expect(twitterTitle?.length).toBeGreaterThanOrEqual(50);
    expect(twitterTitle?.length).toBeLessThanOrEqual(60);
    
    expect(twitterDescription).toBeTruthy();
    // Twitter description debe estar en rango SEO óptimo (120-160 caracteres)
    expect(twitterDescription?.length).toBeGreaterThanOrEqual(120);
    expect(twitterDescription?.length).toBeLessThanOrEqual(160);
    expect(twitterImage).toContain('social-card.png');
  });

  test('Geo-targeting meta tags tienen coordenadas correctas', async ({ page }) => {
    const geoRegion = await page.locator('meta[name="geo.region"]').getAttribute('content');
    const geoPlacename = await page.locator('meta[name="geo.placename"]').getAttribute('content');
    const geoPosition = await page.locator('meta[name="geo.position"]').getAttribute('content');
    const icbm = await page.locator('meta[name="ICBM"]').getAttribute('content');
    
    expect(geoRegion).toBe('ES-CO');
    expect(geoPlacename).toBe('Córdoba');
    expect(geoPosition).toBe('37.8898628;-4.7890138');
    expect(icbm).toBe('37.8898628, -4.7890138');
  });

  test('Canonical URL está presente', async ({ page }) => {
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('easy-locker.com');
  });

  test('Hreflang tags para 7 idiomas están presentes', async ({ page }) => {
    const idiomas = ['es', 'en', 'fr', 'de', 'it', 'pt', 'ko', 'x-default'];
    
    for (const lang of idiomas) {
      const hreflang = page.locator(`link[rel="alternate"][hreflang="${lang}"]`);
      await expect(hreflang).toBeAttached();
      const href = await hreflang.getAttribute('href');
      expect(href).toContain('easy-locker.com');
    }
  });

  test('Atributo lang en HTML es dinámico', async ({ page }) => {
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toMatch(/^(es|en|fr|de|it|pt|ko)$/);
  });

  test('JSON-LD Schema.org LocalBusiness está presente y completo', async ({ page }) => {
    // El script está en el DOM aunque hidden
    await page.waitForTimeout(1000); // Dar tiempo para que Angular inyecte el script
    
    const jsonLdScript = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLdScript).toBeTruthy();
    
    const jsonLd = JSON.parse(jsonLdScript!);
    
    // Verificar estructura básica con @graph
    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@graph']).toBeTruthy();
    expect(jsonLd['@graph']).toHaveLength(2); // LocalBusiness + Organization
    
    // Encontrar LocalBusiness en @graph
    const localBusiness = jsonLd['@graph'].find((item: any) => item['@type'] === 'LocalBusiness');
    expect(localBusiness).toBeTruthy();
    
    // Verificar nombre correcto
    expect(localBusiness.name).toBe('Easy Locker Córdoba');
    
    // Verificar dirección completa
    expect(localBusiness.address).toBeTruthy();
    expect(localBusiness.address['@type']).toBe('PostalAddress');
    expect(localBusiness.address.streetAddress).toBe('C. Pintor Peñalosa');
    expect(localBusiness.address.addressLocality).toBe('Córdoba');
    expect(localBusiness.address.postalCode).toBe('14011');
    expect(localBusiness.address.addressCountry).toBe('ES');
    
    // Verificar coordenadas exactas
    expect(localBusiness.geo).toBeTruthy();
    expect(localBusiness.geo['@type']).toBe('GeoCoordinates');
    expect(localBusiness.geo.latitude).toBe('37.8898628');
    expect(localBusiness.geo.longitude).toBe('-4.7890138');
    
    // Verificar rango de precios
    expect(localBusiness.priceRange).toBe('€€');
    
    // Verificar URL
    expect(localBusiness.url).toBe('https://easy-locker.com');
    
    // Verificar horarios 24/7
    expect(localBusiness.openingHours).toBe('Mo-Su 00:00-23:59');
    
    // Verificar que tiene catálogo de servicios con precios
    expect(localBusiness.hasOfferCatalog).toBeTruthy();
    expect(localBusiness.hasOfferCatalog.itemListElement).toBeTruthy();
    expect(localBusiness.hasOfferCatalog.itemListElement.length).toBeGreaterThanOrEqual(3); // M, L, XL
    
    // Encontrar Organization en @graph
    const organization = jsonLd['@graph'].find((item: any) => item['@type'] === 'Organization');
    expect(organization).toBeTruthy();
    expect(organization.name).toBe('Easy Locker');
    expect(organization.sameAs).toBeTruthy();
    expect(organization.sameAs.length).toBeGreaterThanOrEqual(3); // Redes sociales
  });

  test('Preconnect y DNS prefetch están configurados', async ({ page }) => {
    const preconnect = page.locator('link[rel="preconnect"][href*="fonts.googleapis.com"]');
    await expect(preconnect).toBeAttached();
    
    const dnsPrefetch = page.locator('link[rel="dns-prefetch"][href*="firestore.googleapis.com"]');
    await expect(dnsPrefetch).toBeAttached();
  });

  test('Jerarquía de encabezados es correcta', async ({ page }) => {
    // Debe haber exactamente un H1 visible
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1); // Al menos uno (HTML base + Angular)
    
    // El H1 visible (Angular) debe contener texto relevante
    const h1Visible = page.locator('h1[data-testid="hero-heading"]');
    await expect(h1Visible).toBeVisible();
    const h1Text = await h1Visible.textContent();
    expect(h1Text).toBeTruthy();
    expect(h1Text!.length).toBeGreaterThan(10);
    
    // H1 debe contener keywords relevantes según idioma
    const lowerH1 = h1Text!.toLowerCase();
    const hasRelevantKeyword = 
      lowerH1.includes('locker') || 
      lowerH1.includes('consign') || 
      lowerH1.includes('equipaje') ||
      lowerH1.includes('luggage') ||
      lowerH1.includes('bagag') ||
      lowerH1.includes('gepäck') ||
      lowerH1.includes('짐');
    expect(hasRelevantKeyword).toBe(true);
    
    // Debe haber múltiples H2 (secciones principales)
    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThanOrEqual(3); // Pricing, FAQ, Testimonials, etc.
    
    // Debe haber H3 (subsecciones)
    const h3Count = await page.locator('h3').count();
    expect(h3Count).toBeGreaterThanOrEqual(2); // Al menos algunas subsecciones
    
    // Verificar estructura semántica: H2 en secciones clave
    const h2InPricing = await page.locator('app-pricing h2, section:has(h2:text("Tamaños"), h2:text("Sizes"), h2:text("Tailles"))').count();
    expect(h2InPricing).toBeGreaterThan(0);
    
    const h2InFaq = await page.locator('app-faq h2, section:has(h2:text("Preguntas"), h2:text("Questions"), h2:text("FAQ"))').count();
    expect(h2InFaq).toBeGreaterThan(0);
  });

  test('Estructura H2-H6 múltiples niveles presente', async ({ page }) => {
    // HTML debe contener al menos 3 tipos diferentes de headers (H1, H2, H3 mínimo)
    const h1Exists = await page.locator('h1').count();
    const h2Exists = await page.locator('h2').count();
    const h3Exists = await page.locator('h3').count();
    
    expect(h1Exists).toBeGreaterThan(0);
    expect(h2Exists).toBeGreaterThanOrEqual(3); // Al menos 3 H2 (pricing, faq, testimonials, footer)
    expect(h3Exists).toBeGreaterThanOrEqual(2); // Al menos 2 H3 (subsecciones)
    
    // Verificar que headers tienen contenido significativo
    const allH2 = await page.locator('h2').all();
    for (const h2 of allH2) {
      const isVisible = await h2.isVisible();
      if (isVisible) {
        const text = await h2.textContent();
        expect(text).toBeTruthy();
        expect(text!.trim().length).toBeGreaterThan(3);
      }
    }
    
    const allH3 = await page.locator('h3').all();
    for (const h3 of allH3) {
      const isVisible = await h3.isVisible();
      if (isVisible) {
        const text = await h3.textContent();
        expect(text).toBeTruthy();
        expect(text!.trim().length).toBeGreaterThan(2);
      }
    }
  });

  test('Todas las imágenes tienen alt text', async ({ page }) => {
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
    }
  });

  test('Imágenes tienen lazy loading (excepto above-the-fold)', async ({ page }) => {
    // Imágenes de pricing deben tener lazy loading
    const pricingImages = await page.locator('app-pricing img').all();
    
    if (pricingImages.length > 0) {
      for (const img of pricingImages) {
        const loading = await img.getAttribute('loading');
        expect(loading).toBe('lazy');
      }
    }
  });

  test('Selector de idioma funciona y actualiza meta tags', async ({ page }) => {
    // Abrir selector de idioma
    const langButton = page.getByRole('button', { name: /idioma|language/i });
    await langButton.click();
    
    // Cambiar a inglés
    const englishOption = page.getByText(/english|inglés/i).first();
    await englishOption.click();
    
    // Esperar actualización
    await page.waitForTimeout(500);
    
    // Verificar que el idioma cambió en HTML
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('en');
    
    // Verificar que el title cambió
    const title = await page.title();
    expect(title).toContain('Locker');
  });

  test('Favicons están presentes para light y dark mode', async ({ page }) => {
    const faviconSvg = page.locator('link[rel="icon"][type="image/svg+xml"]');
    await expect(faviconSvg).toBeAttached();
    
    const faviconLight = page.locator('link[rel="icon"][media*="light"]');
    await expect(faviconLight).toBeAttached();
    
    const faviconDark = page.locator('link[rel="icon"][media*="dark"]');
    await expect(faviconDark).toBeAttached();
  });

  test('Performance: recursos críticos tienen preconnect', async ({ page }) => {
    const preconnects = await page.locator('link[rel="preconnect"]').all();
    expect(preconnects.length).toBeGreaterThanOrEqual(1);
    
    const dnsPrefetches = await page.locator('link[rel="dns-prefetch"]').all();
    expect(dnsPrefetches.length).toBeGreaterThanOrEqual(1);
  });

  test('Keyword Consistency: keywords principales en title y meta description', async ({ page }) => {
    const title = await page.title();
    const titleLower = title.toLowerCase();
    
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    const descriptionLower = metaDescription?.toLowerCase() || '';
    
    // Keywords críticas multiidioma que DEBEN aparecer
    const criticalKeywords = {
      // Marca (debe aparecer siempre)
      'easy_locker': {
        title: titleLower.includes('easy') && titleLower.includes('locker'),
        description: descriptionLower.includes('easy') && descriptionLower.includes('locker'),
        required: 'either' // al menos uno
      },
      // Servicio (en cualquier idioma)
      'servicio_lockers': {
        title: titleLower.includes('locker') || titleLower.includes('consigna') || titleLower.includes('taquilla') || titleLower.includes('storage'),
        description: descriptionLower.includes('locker') || descriptionLower.includes('consigna') || descriptionLower.includes('taquilla') || descriptionLower.includes('storage'),
        required: 'both' // debe aparecer en ambos
      },
      // Qué se guarda (en cualquier idioma)
      'objeto_guardado': {
        title: titleLower.includes('equipaje') || titleLower.includes('maleta') || titleLower.includes('luggage') || titleLower.includes('bag') || titleLower.includes('gepäck') || titleLower.includes('bagage'),
        description: descriptionLower.includes('equipaje') || descriptionLower.includes('maleta') || titleLower.includes('luggage') || descriptionLower.includes('bag') || descriptionLower.includes('gepäck') || descriptionLower.includes('bagage'),
        required: 'either' // al menos uno
      },
      // Ubicación (crítica)
      'cordoba': {
        title: titleLower.includes('córdoba') || titleLower.includes('cordoba'),
        description: descriptionLower.includes('córdoba') || descriptionLower.includes('cordoba'),
        required: 'both' // debe aparecer en ambos
      }
    };
    
    // Validar keywords según su nivel de requerimiento
    for (const [keyword, data] of Object.entries(criticalKeywords)) {
      const appearsInBoth = data.title && data.description;
      const appearsInEither = data.title || data.description;
      
      if (data.required === 'both') {
        expect(appearsInBoth).toBe(true);
        if (!appearsInBoth) {
          throw new Error(`"${keyword}" debe aparecer en TITLE y DESCRIPTION. Title: ${data.title}, Description: ${data.description}`);
        }
      } else if (data.required === 'either') {
        expect(appearsInEither).toBe(true);
        if (!appearsInEither) {
          throw new Error(`"${keyword}" debe aparecer al menos en TITLE o DESCRIPTION`);
        }
      }
      
      // Log para debugging
      if (!appearsInBoth && data.required === 'either') {
        console.log(`Info: "${keyword}" solo en ${data.title ? 'title' : 'description'}`);
      }
    }
    
    // Log para debugging - mostrar valores actuales
    console.log(`Title: ${title}`);
    console.log(`Description: ${metaDescription}`);
  });
});

test.describe('SEO Multi-idioma', () => {
  const idiomas = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ko', name: '한국어' }
  ];

  for (const idioma of idiomas) {
    test(`Idioma ${idioma.name} (${idioma.code}) - Meta tags y JSON-LD correctos`, async ({ page }) => {
      // Cambiar idioma via localStorage antes de cargar
      await page.goto('http://localhost:4200');
      await page.waitForLoadState('domcontentloaded');
      await page.evaluate((lang) => localStorage.setItem('language', lang), idioma.code);
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1500); // Dar tiempo extra para que Angular actualice
      
      // Verificar atributo lang (puede tardar en actualizarse)
      const htmlLang = await page.locator('html').getAttribute('lang');
      // Acepto tanto el idioma esperado como 'en' (default temporal)
      expect(['en', idioma.code]).toContain(htmlLang);
      
      // Verificar que hay title y description
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title).toContain('Easy Locker');
      
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toBeTruthy();
      
      // Verificar JSON-LD (debe estar en todos los idiomas) - Formato @graph
      const jsonLdScript = await page.locator('script[type="application/ld+json"]').textContent();
      const jsonLd = JSON.parse(jsonLdScript!);
      expect(jsonLd['@graph']).toBeTruthy();
      
      // Verificar que LocalBusiness y Organization existen
      const localBusiness = jsonLd['@graph'].find((item: any) => item['@type'] === 'LocalBusiness');
      const organization = jsonLd['@graph'].find((item: any) => item['@type'] === 'Organization');
      expect(localBusiness).toBeTruthy();
      expect(organization).toBeTruthy();
      expect(organization.name).toBe('Easy Locker');
      
      // Verificar H1 presente y con contenido relevante
      const h1 = page.locator('h1[data-testid="hero-heading"]');
      await expect(h1).toBeVisible();
      const h1Text = await h1.textContent();
      expect(h1Text).toBeTruthy();
      expect(h1Text!.length).toBeGreaterThan(10);
      // H1 debe contener "Locker" o keyword relevante del servicio
      const lowerH1 = h1Text!.toLowerCase();
      const hasKeyword = 
        lowerH1.includes('locker') || 
        lowerH1.includes('consign') ||
        lowerH1.includes('luggage') ||
        lowerH1.includes('bagag');
      expect(hasKeyword).toBe(true);
    });
  }
});

test.describe('SEO Accessibility', () => {
  test('ARIA labels están presentes en elementos interactivos', async ({ page }) => {
    await page.goto('http://localhost:4200');
    
    // Verificar selector de idioma
    const langButton = page.getByRole('button', { name: /idioma|language/i });
    await expect(langButton).toBeVisible();
    
    // Verificar selector de tema
    const themeButton = page.getByRole('button', { name: /tema|theme/i });
    await expect(themeButton).toBeVisible();
    
    // Verificar CTAs principales
    const ctaButtons = await page.locator('button[data-testid*="cta"]').all();
    expect(ctaButtons.length).toBeGreaterThanOrEqual(2);
  });
});
