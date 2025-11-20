import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export interface LanguageOption {
  code: string;
  labelKey: string;
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'language';
  private readonly defaultLanguage = 'en';
  private readonly supportedLanguages: LanguageOption[] = [
    { code: 'es', labelKey: 'header.language.options.es' },
    { code: 'en', labelKey: 'header.language.options.en' },
    { code: 'fr', labelKey: 'header.language.options.fr' },
    { code: 'de', labelKey: 'header.language.options.de' },
    { code: 'it', labelKey: 'header.language.options.it' },
  ];
  private initialized = false;
  private languageSubject = new BehaviorSubject<string>(this.defaultLanguage);

  language$ = this.languageSubject.asObservable();

  constructor(private translate: TranslateService) {}

  init(): void {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    this.translate.setDefaultLang(this.defaultLanguage);
    this.translate.addLangs(this.supportedLanguages.map((lang) => lang.code));

    const stored = this.getStoredLanguage();
    if (stored) {
      this.applyLanguage(stored, false);
      return;
    }

    const detected = this.detectBrowserLanguage();
    this.applyLanguage(detected ?? this.defaultLanguage, false);
  }

  setLanguage(languageCode: string): void {
    this.applyLanguage(languageCode, true);
  }

  getSupportedLanguages(): LanguageOption[] {
    return this.supportedLanguages;
  }

  getCurrentLanguage(): string {
    return this.languageSubject.value;
  }

  private applyLanguage(languageCode: string, persist: boolean): void {
    const normalized = this.normalizeLocale(languageCode);
    const finalLang = this.isSupported(normalized) ? normalized : this.defaultLanguage;
    this.translate.use(finalLang);
    this.languageSubject.next(finalLang);
    if (persist) {
      try {
        localStorage.setItem(this.storageKey, finalLang);
      } catch (error) {
        // Ignore storage errors (e.g., privacy mode)
      }
    }
  }

  private getStoredLanguage(): string | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored && this.isSupported(stored) ? stored : null;
    } catch (error) {
      return null;
    }
  }

  private detectBrowserLanguage(): string | null {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return null;
    }
    const preferred = navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : navigator.language
      ? [navigator.language]
      : [];

    for (const locale of preferred) {
      const normalized = this.normalizeLocale(locale);
      if (this.isSupported(normalized)) {
        return normalized;
      }
    }

    return null;
  }

  private normalizeLocale(locale: string): string {
    if (!locale) {
      return '';
    }
    return locale.toLowerCase().split('-')[0];
  }

  private isSupported(code: string): boolean {
    return this.supportedLanguages.some((lang) => lang.code === code);
  }
}
