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
}
