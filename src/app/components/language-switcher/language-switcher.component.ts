import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css'],
  animations: [
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-4px)' }),
        animate(
          '180ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '160ms ease-in',
          style({ opacity: 0, transform: 'translateY(-4px)' })
        ),
      ]),
    ]),
  ],
})
export class LanguageSwitcherComponent implements OnInit {
  open = false;
  currentLanguage = 'es';
  readonly languages = [
    { code: 'es', name: 'ES' },
    { code: 'en', name: 'EN' },
    { code: 'fr', name: 'FR' },
    { code: 'de', name: 'DE' },
    { code: 'it', name: 'IT' },
  ];

  constructor(
    private translate: TranslateService,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    const storedLanguage = localStorage.getItem('language');
    this.currentLanguage =
      storedLanguage || this.translate.currentLang || this.currentLanguage;
    this.translate.use(this.currentLanguage);
  }

  toggleDropdown(): void {
    this.open = !this.open;
  }

  changeLanguage(langCode: string): void {
    if (this.currentLanguage === langCode) {
      this.open = false;
      return;
    }

    this.currentLanguage = langCode;
    this.translate.use(langCode);
    localStorage.setItem('language', langCode);
    this.open = false;
  }

  getCurrentLanguageName(): string {
    const lang = this.languages.find((l) => l.code === this.currentLanguage);
    return lang ? lang.name : 'ES';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.open) {
      return;
    }

    const target = event.target as Node;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.open = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.open = false;
  }
}
