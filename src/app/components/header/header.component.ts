import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ThemePreference, ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';
import { DropdownCoordinatorService } from '../../services/dropdown-coordinator.service';
import { dropdownAnimation } from '../../animations/dropdown.animation';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [dropdownAnimation]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  themeMenuOpen = false;
  currentPreference: ThemePreference = 'system';
  private readonly dropdownId = 'theme-preference';
  readonly themeOptions: { value: ThemePreference; labelKey: string; descriptionKey: string }[] = [
    {
      value: 'light',
      labelKey: 'header.theme.options.light.label',
      descriptionKey: 'header.theme.options.light.description'
    },
    {
      value: 'dark',
      labelKey: 'header.theme.options.dark.label',
      descriptionKey: 'header.theme.options.dark.description'
    },
    {
      value: 'system',
      labelKey: 'header.theme.options.system.label',
      descriptionKey: 'header.theme.options.system.description'
    },
  ];
  private subscriptions = new Subscription();

  constructor(
    private themeService: ThemeService,
    private elementRef: ElementRef<HTMLElement>,
    private dropdownCoordinator: DropdownCoordinatorService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.themeService.darkMode$.subscribe((isDark) => (this.isDarkMode = isDark))
    );

    this.subscriptions.add(
      this.themeService.preference$.subscribe(
        (preference) => (this.currentPreference = preference)
      )
    );

    this.subscriptions.add(
      this.dropdownCoordinator.openDropdown$.subscribe((openId) => {
        this.themeMenuOpen = openId === this.dropdownId;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.dropdownCoordinator.close(this.dropdownId);
  }

  toggleThemeMenu(): void {
    this.dropdownCoordinator.toggle(this.dropdownId);
  }

  selectTheme(preference: ThemePreference): void {
    this.themeService.setPreference(preference);
    this.dropdownCoordinator.close(this.dropdownId);
  }

  getThemeLabelKey(): string {
    const option = this.themeOptions.find(
      (themeOption) => themeOption.value === this.currentPreference
    );
    return option?.labelKey ?? 'header.theme.options.system.label';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.themeMenuOpen) {
      return;
    }
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.dropdownCoordinator.close(this.dropdownId);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.dropdownCoordinator.close(this.dropdownId);
  }
}
