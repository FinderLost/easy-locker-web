import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import {
  DEFAULT_ROUTING_LANG,
  isRoutingLanguage,
  normalizeRoutingLanguage,
} from '../../core/constants/routing-languages';

@Component({
  selector: 'app-language-redirect',
  template: '',
})
export class LanguageRedirectComponent implements OnInit {
  constructor(
    private router: Router,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    const targetLang = this.pickLanguage();
    this.languageService.setLanguage(targetLang);
    this.router.navigate(['/', targetLang], { replaceUrl: true });
  }

  private pickLanguage(): string {
    const initial = this.languageService.resolveInitialLanguage();
    const normalized = normalizeRoutingLanguage(initial);
    if (isRoutingLanguage(normalized)) {
      return normalized;
    }
    return DEFAULT_ROUTING_LANG;
  }
}
