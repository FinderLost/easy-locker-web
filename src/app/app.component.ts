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
import {
  DEFAULT_ROUTING_LANG,
  ROUTING_LANGS,
  isRoutingLanguage,
} from './core/constants/routing-languages';

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
  private readonly routingLangs = ROUTING_LANGS;

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

    if (cookieLang) {
      this.updateCookiePolicySeo(cookieLang);
      return;
    }

    this.updateHomeSeo();
  }

  private updateHomeSeo(): void {
    const lang = this.getRoutingLanguage();
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

    this.setCanonical(this.buildLanguageUrl(lang));
    this.setHomeHreflangLinks();
  }

  private updateCookiePolicySeo(lang: string): void {
    if (this.languageService.getCurrentLanguage() !== lang) {
      this.languageService.setLanguage(lang);
    }

    const seoTitle = this.translate.instant('cookiePolicy.title');
    const seoDescription = this.translate.instant('cookiePolicy.summary');
    const keywords = this.translate.instant('seo.home.keywords');
    const slug = COOKIE_POLICY_SLUGS[lang] ?? COOKIE_POLICY_SLUGS['en'];
    const canonicalUrl = `${this.baseUrl}/${slug}`;

    this.titleService.setTitle(seoTitle);
    this.metaService.updateTag({ name: 'description', content: seoDescription });
    this.metaService.updateTag({ name: 'keywords', content: keywords });
    this.metaService.updateTag({ property: 'og:title', content: seoTitle });
    this.metaService.updateTag({ property: 'og:description', content: seoDescription });
    this.metaService.updateTag({ name: 'twitter:title', content: seoTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: seoDescription });

    this.setCanonical(canonicalUrl);
    this.setHreflangLinks();
  }

  private setCanonical(url: string): void {
    this.upsertLinkTag('canonical', url);
  }

  private setHreflangLinks(): void {
    Object.entries(COOKIE_POLICY_SLUGS).forEach(([lang, slug]) => {
      this.upsertLinkTag('alternate', `${this.baseUrl}/${slug}`, lang);
    });

    if (COOKIE_POLICY_SLUGS['en']) {
      this.upsertLinkTag('alternate', `${this.baseUrl}/${COOKIE_POLICY_SLUGS['en']}`, 'x-default');
    }
  }

  private setHomeHreflangLinks(): void {
    this.upsertLinkTag('alternate', `${this.baseUrl}/`, 'x-default');

    this.routingLangs.forEach((lang) => {
      this.upsertLinkTag('alternate', this.buildLanguageUrl(lang), lang);
    });
  }

  private upsertLinkTag(rel: string, href: string, hreflang?: string): void {
    if (!this.document?.head) {
      return;
    }

    const selectors = [
      `link[rel="${rel}"]`,
      `[${this.managedLinkAttr}="${this.managedLinkValue}"]`,
    ];

    if (hreflang) {
      selectors.push(`[hreflang="${hreflang}"]`);
    }

    const selector = selectors.join('');
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      link.setAttribute(this.managedLinkAttr, this.managedLinkValue);
      if (hreflang) {
        link.setAttribute('hreflang', hreflang);
      }
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

  private buildLanguageUrl(lang: string): string {
    return `${this.baseUrl}/${lang}/`;
  }

  private getRoutingLanguage(): string {
    const lang = this.languageService.getCurrentLanguage();
    if (isRoutingLanguage(lang)) {
      return lang;
    }
    return DEFAULT_ROUTING_LANG;
  }
}
