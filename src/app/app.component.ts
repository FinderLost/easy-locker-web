import { Component, OnDestroy, OnInit } from '@angular/core';
import { LanguageService } from './services/language.service';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AnalyticsService } from './core/analytics/analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'easy-locker-angular';
  private destroy$ = new Subject<void>();

  constructor(
    private languageService: LanguageService,
    private titleService: Title,
    private metaService: Meta,
    private translate: TranslateService,
    private readonly _analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.languageService.init();
    this.updateSeo();
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateSeo());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateSeo(): void {
    const seoTitle = this.translate.instant('seo.home.title');
    const seoDescription = this.translate.instant('seo.home.description');

    this.titleService.setTitle(seoTitle);
    this.metaService.updateTag({ name: 'description', content: seoDescription });
    this.metaService.updateTag({ property: 'og:title', content: seoTitle });
    this.metaService.updateTag({ property: 'og:description', content: seoDescription });
    this.metaService.updateTag({ name: 'twitter:title', content: seoTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: seoDescription });
  }
}
