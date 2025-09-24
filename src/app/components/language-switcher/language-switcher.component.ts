import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent {
  open = false;
  currentLanguage = 'es';
  languages = [
    { code: 'es', name: 'ES' },
    { code: 'en', name: 'EN' }
  ];

  constructor(private translate: TranslateService) {
    this.currentLanguage = this.translate.currentLang || 'es';
  }

  toggleDropdown() {
    this.open = !this.open;
  }

  changeLanguage(langCode: string) {
    this.currentLanguage = langCode;
    this.translate.use(langCode);
    this.open = false;
    localStorage.setItem('language', langCode);
  }

  getCurrentLanguageName(): string {
    const lang = this.languages.find(l => l.code === this.currentLanguage);
    return lang ? lang.name : 'ES';
  }
}
