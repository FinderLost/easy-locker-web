import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { LanguageService } from '../../services/language.service';
import {
  DEFAULT_ROUTING_LANG,
  ROUTING_LANGS,
  isRoutingLanguage,
  normalizeRoutingLanguage,
} from '../constants/routing-languages';

@Injectable({ providedIn: 'root' })
export class LanguageRouteGuard implements CanActivate {
  constructor(
    private router: Router,
    private languageService: LanguageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): boolean | UrlTree {
    const raw = route.paramMap.get('lang');
    const normalized = normalizeRoutingLanguage(raw);
    const allowedLang = isRoutingLanguage(normalized)
      ? normalized
      : this.pickFallbackLanguage();

    this.languageService.setLanguage(allowedLang);

    if (normalized !== allowedLang) {
      return this.router.createUrlTree(['/', allowedLang]);
    }

    return true;
  }

  private pickFallbackLanguage(): string {
    const initial = this.languageService.resolveInitialLanguage();
    const normalized = normalizeRoutingLanguage(initial);
    if (isRoutingLanguage(normalized)) {
      return normalized;
    }
    if (ROUTING_LANGS.includes(this.languageService.getDefaultLanguage())) {
      return this.languageService.getDefaultLanguage();
    }
    return DEFAULT_ROUTING_LANG;
  }
}
