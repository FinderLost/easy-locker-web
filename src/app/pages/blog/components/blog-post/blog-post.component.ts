import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { BlogService } from '../../services/blog.service';
import { BlogPost, Language } from '../../models/blog-post.model';
import { LanguageService } from '../../../../services/language.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent implements OnInit, OnDestroy {
  post$!: Observable<BlogPost | null>;
  post: BlogPost | null = null;
  currentLang: Language = 'es';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private languageService: LanguageService,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.currentLang = this.languageService.getCurrentLanguage() as Language;

    this.route.params.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const slug = params['slug'];
        return this.blogService.getPostBySlug(slug, this.currentLang);
      })
    ).subscribe(post => {
      if (!post) {
        this.router.navigate([`/${this.currentLang}/blog`]);
        return;
      }
      this.post = post;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  onReserveClick(): void {
    const reserveUrl = `https://easylocker.drop-point.com/booking-engine?locker_ref=EASYLOCKER1&locale=${this.currentLang}`;
    this.document.defaultView?.open(reserveUrl, '_blank');
  }

  getCategoryLabel(): string {
    if (!this.post) return '';
    const labels: Record<string, Partial<Record<Language, string>>> = {
      'guias-turisticas': { es: 'Guías turísticas', en: 'Travel Guides' },
      'consejos-viaje': { es: 'Consejos de viaje', en: 'Travel Tips' },
      'eventos-cordoba': { es: 'Eventos en Córdoba', en: 'Events in Córdoba' },
      'gastronomia': { es: 'Gastronomía', en: 'Gastronomy' },
      'historia-cultura': { es: 'Historia y cultura', en: 'History & Culture' }
    };
    return labels[this.post.category]?.[this.currentLang] || this.post.category;
  }
}
