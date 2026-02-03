import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LanguageService } from './services/language.service';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CookieConsentService } from './core/services/cookie-consent.service';
import { DOCUMENT } from '@angular/common';
import {
  COOKIE_POLICY_SLUGS,
  findCookiePolicyLanguage,
} from './core/models/cookie-policy-routing';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'easy-locker-angular';
  private destroy$ = new Subject<void>();
  private readonly baseUrl = 'https://easy-locker.com';
  private readonly managedLinkAttr = 'data-managed';
  private readonly managedLinkValue = 'seo-link';

  constructor(
    private languageService: LanguageService,
    private titleService: Title,
    private metaService: Meta,
    private translate: TranslateService,
    private router: Router,
    public cookieConsent: CookieConsentService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.languageService.init();
    this.updateSeo();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.updateSeo());
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateSeo());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateSeo(): void {
    const path = this.normalizePath(this.router.url);
    const cookieLang = findCookiePolicyLanguage(path);

    this.clearManagedLinks();
    this.setRobotsTag('index,follow');
    this.updateHtmlLang();

    if (cookieLang) {
      this.updateCookiePolicySeo(cookieLang);
      this.addHreflangTags();
      return;
    }

    // Detectar rutas de blog individual
    const blogPostMatch = path.match(/^[a-z]{2}\/blog\/(articulo|article)\/([a-z0-9-]+)$/);
    if (blogPostMatch) {
      const slug = blogPostMatch[2];
      this.updateBlogPostSeo(slug);
      return;
    }

    this.updateHomeSeo();
    this.addHreflangTags();
    this.injectStructuredData();
  }

  private updateHomeSeo(): void {
    const seoTitle = this.translate.instant('seo.home.title');
    const seoDescription = this.translate.instant('seo.home.description');
    const seoKeywords = this.translate.instant('seo.home.keywords');

    this.titleService.setTitle(seoTitle);
    this.metaService.updateTag({ name: 'description', content: seoDescription });
    this.metaService.updateTag({ name: 'keywords', content: seoKeywords });
    this.metaService.updateTag({ property: 'og:title', content: seoTitle });
    this.metaService.updateTag({ property: 'og:description', content: seoDescription });
    this.metaService.updateTag({ name: 'twitter:title', content: seoTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: seoDescription });

    this.setCanonical(`${this.baseUrl}/`);
  }

  private updateBlogPostSeo(slug: string): void {
    const currentLang = this.languageService.getCurrentLanguage();
    
    // Cargar el post desde assets/data/blog-posts.json
    import('../assets/data/blog-posts.json').then((module: any) => {
      const posts = module.default || module;
      const post = posts.find((p: any) => 
        p.slug.es === slug || p.slug.en === slug
      );

      if (!post) {
        this.updateHomeSeo();
        return;
      }

      const metaTitle = post.metaTitle[currentLang] || post.title[currentLang];
      const metaDescription = post.metaDescription[currentLang] || post.excerpt[currentLang];
      const keywords = post.keywords[currentLang]?.join(', ') || '';
      const articleSlug = currentLang === 'es' ? 'articulo' : 'article';
      const postSlug = post.slug[currentLang];
      const canonicalUrl = `${this.baseUrl}/${currentLang}/blog/${articleSlug}/${postSlug}`;
      const imageUrl = post.featuredImage.url.startsWith('http') 
        ? post.featuredImage.url 
        : `${this.baseUrl}${post.featuredImage.url}`;

      this.titleService.setTitle(metaTitle);
      this.metaService.updateTag({ name: 'description', content: metaDescription });
      this.metaService.updateTag({ name: 'keywords', content: keywords });
      
      // Open Graph
      this.metaService.updateTag({ property: 'og:type', content: 'article' });
      this.metaService.updateTag({ property: 'og:title', content: metaTitle });
      this.metaService.updateTag({ property: 'og:description', content: metaDescription });
      this.metaService.updateTag({ property: 'og:url', content: canonicalUrl });
      this.metaService.updateTag({ property: 'og:image', content: imageUrl });
      this.metaService.updateTag({ property: 'article:published_time', content: post.publishedAt });
      this.metaService.updateTag({ property: 'article:author', content: post.author });
      
      // Twitter Cards
      this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.metaService.updateTag({ name: 'twitter:title', content: metaTitle });
      this.metaService.updateTag({ name: 'twitter:description', content: metaDescription });
      this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });

      this.setCanonical(canonicalUrl);
      this.addBlogHreflangTags(post);
      this.injectArticleSchema(post, currentLang);
    }).catch(err => {
      console.error('Error loading blog post for SEO:', err);
      this.updateHomeSeo();
    });
  }

  private updateCookiePolicySeo(lang: string): void {
    if (this.languageService.getCurrentLanguage() !== lang) {
      this.languageService.setLanguage(lang);
    }

    const seoTitle = this.translate.instant('cookiePolicy.title');
    const seoDescription = this.translate.instant('cookiePolicy.summary');
    const keywords = this.translate.instant('seo.home.keywords');
    const slug = COOKIE_POLICY_SLUGS[lang] ?? COOKIE_POLICY_SLUGS['en'];

    this.titleService.setTitle(seoTitle);
    this.metaService.updateTag({ name: 'description', content: seoDescription });
    this.metaService.updateTag({ name: 'keywords', content: keywords });
    this.metaService.updateTag({ property: 'og:title', content: seoTitle });
    this.metaService.updateTag({ property: 'og:description', content: seoDescription });
    this.metaService.updateTag({ name: 'twitter:title', content: seoTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: seoDescription });

    this.setCanonical(`${this.baseUrl}/`);
  }

  private setCanonical(url: string): void {
    this.upsertLinkTag('canonical', url);
  }

  private upsertLinkTag(rel: string, href: string, hreflang?: string): void {
    if (!this.document?.head) {
      return;
    }

    const selector = `link[rel="${rel}"][${this.managedLinkAttr}="${this.managedLinkValue}"]`;
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      link.setAttribute(this.managedLinkAttr, this.managedLinkValue);
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', href);
  }

  private clearManagedLinks(): void {
    if (!this.document?.head) {
      return;
    }

    const managedLinks = this.document.head.querySelectorAll(
      `link[${this.managedLinkAttr}="${this.managedLinkValue}"]`
    );

    managedLinks.forEach((link) => link.remove());
  }

  private normalizePath(url: string): string {
    return url.replace(/^\//, '').split('?')[0].split('#')[0];
  }

  private setRobotsTag(content: string): void {
    this.metaService.updateTag({ name: 'robots', content });
  }

  private updateHtmlLang(): void {
    const currentLang = this.languageService.getCurrentLanguage();
    this.document.documentElement.lang = currentLang;
  }

  private addHreflangTags(): void {
    const supportedLanguages = ['es', 'en', 'fr', 'de', 'it', 'pt', 'ko'];
    supportedLanguages.forEach(lang => {
      this.upsertLinkTagWithHreflang('alternate', `${this.baseUrl}/`, lang);
    });
    // x-default apunta al español como idioma por defecto
    this.upsertLinkTagWithHreflang('alternate', `${this.baseUrl}/`, 'x-default');
  }

  private upsertLinkTagWithHreflang(rel: string, href: string, hreflang: string): void {
    if (!this.document?.head) {
      return;
    }

    const selector = `link[rel="${rel}"][hreflang="${hreflang}"][${this.managedLinkAttr}="${this.managedLinkValue}"]`;
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      link.setAttribute('hreflang', hreflang);
      link.setAttribute(this.managedLinkAttr, this.managedLinkValue);
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', href);
  }

  private injectStructuredData(): void {
    const existingScript = this.document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      return; // Ya existe, no duplicar
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': 'Easy Locker | Consigna & Luggage Storage',
      'image': 'https://easy-locker.com/assets/images/social-card.png',
      'description': this.translate.instant('seo.home.description'),
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'C. Pintor Peñalosa, Local 11',
        'addressLocality': 'Córdoba',
        'addressRegion': 'Andalucía',
        'postalCode': '14011',
        'addressCountry': 'ES'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '37.8898628',
        'longitude': '-4.7890138'
      },
      'url': 'https://easy-locker.com',
      'telephone': '+34665922538',
      'priceRange': '€',
      'openingHoursSpecification': {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        'opens': '00:00',
        'closes': '23:59'
      },
      'sameAs': [
        'https://www.facebook.com/share/1Got7XaYUE/',
        'https://www.instagram.com/easylocker.es/',
        'https://www.tiktok.com/@easylocker.es'
      ]
    };

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    this.document.head.appendChild(script);
  }

  private addBlogHreflangTags(post: any): void {
    const esSlug = post.slug.es;
    const enSlug = post.slug.en;

    this.upsertLinkTagWithHreflang('alternate', `${this.baseUrl}/es/blog/articulo/${esSlug}`, 'es');
    this.upsertLinkTagWithHreflang('alternate', `${this.baseUrl}/en/blog/article/${enSlug}`, 'en');
    this.upsertLinkTagWithHreflang('alternate', `${this.baseUrl}/es/blog/articulo/${esSlug}`, 'x-default');
  }

  private injectArticleSchema(post: any, currentLang: string): void {
    // Eliminar schema existente si lo hay
    const existingScript = this.document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    const imageUrl = post.featuredImage.url.startsWith('http') 
      ? post.featuredImage.url 
      : `${this.baseUrl}${post.featuredImage.url}`;

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': post.title[currentLang],
      'description': post.excerpt[currentLang],
      'image': imageUrl,
      'author': {
        '@type': 'Person',
        'name': post.author
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Easy Locker',
        'logo': {
          '@type': 'ImageObject',
          'url': `${this.baseUrl}/assets/images/logo.png`
        }
      },
      'datePublished': post.publishedAt,
      'dateModified': post.updatedAt || post.publishedAt,
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `${this.baseUrl}/${currentLang}/blog/${currentLang === 'es' ? 'articulo' : 'article'}/${post.slug[currentLang]}`
      }
    };

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(articleSchema);
    this.document.head.appendChild(script);
  }
}
