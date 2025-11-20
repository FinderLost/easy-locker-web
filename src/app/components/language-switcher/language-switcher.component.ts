import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { LanguageOption, LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';
import { DropdownCoordinatorService } from '../../services/dropdown-coordinator.service';
import { dropdownAnimation } from '../../animations/dropdown.animation';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css'],
  animations: [dropdownAnimation],
})
export class LanguageSwitcherComponent implements OnInit, OnDestroy {
  open = false;
  currentLanguage = 'en';
  readonly languages: LanguageOption[];
  private readonly dropdownId = 'language-selector';
  private subscriptions = new Subscription();

  constructor(
    private languageService: LanguageService,
    private elementRef: ElementRef<HTMLElement>,
    private dropdownCoordinator: DropdownCoordinatorService
  ) {
    this.languages = this.languageService.getSupportedLanguages();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.languageService.language$.subscribe(
        (lang) => (this.currentLanguage = lang)
      )
    );

    this.subscriptions.add(
      this.dropdownCoordinator.openDropdown$.subscribe((openId) => {
        this.open = openId === this.dropdownId;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.dropdownCoordinator.close(this.dropdownId);
  }

  toggleDropdown(): void {
    this.dropdownCoordinator.toggle(this.dropdownId);
  }

  changeLanguage(langCode: string): void {
    if (this.currentLanguage === langCode) {
      this.dropdownCoordinator.close(this.dropdownId);
      return;
    }

    this.languageService.setLanguage(langCode);
    this.dropdownCoordinator.close(this.dropdownId);
  }

  getCurrentLanguageLabelKey(): string {
    const lang = this.languages.find((l) => l.code === this.currentLanguage);
    return lang?.labelKey ?? 'header.language.options.unknown';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.open) {
      return;
    }

    const target = event.target as Node;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.dropdownCoordinator.close(this.dropdownId);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.dropdownCoordinator.close(this.dropdownId);
  }
}
