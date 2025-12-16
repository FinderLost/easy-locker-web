import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subscription, catchError, map, of } from 'rxjs';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { LanguageService } from '../../services/language.service';

interface GoogleReview {
  author: string;
  text: string;
  rating?: number;
  date?: string;
}

interface LocalizedReview {
  author: string;
  rating?: number;
  date?: string;
  original?: { language?: string; text?: string };
  translations: Record<string, string>;
}

interface GooglePlaceReviewResponse {
  reviews?: Array<{
    authorAttribution?: { displayName?: string };
    rating?: number;
    relativePublishTimeDescription?: string;
    publishTime?: string;
    originalText?: { text?: string; languageCode?: string };
    text?: { text?: string; languageCode?: string };
  }>;
  status?: string;
}

interface GoogleReviewsConfig {
  apiKey: string;
  placeId: string;
}

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css'],
})
export class TestimonialsComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly maxReviews = 6;
  private readonly googleApiUrl = 'https://places.googleapis.com/v1/places';

  readonly profileUrl = 'https://share.google/Mz0YZ1RFwkV0uToTK';
  readonly reviewUrl = 'https://g.page/r/Cdlcmss1Q8AFEBM/review';
  private readonly desktopVisibleCount = 3;
  private readonly tabletVisibleCount = 2;
  private readonly mobileVisibleCount = 1;
  readonly autoSlideMs = 5500;

  reviews: GoogleReview[] = [];
  isLoading = true;
  private hasLoggedView = false;
  private sectionVisible = false;
  private visibilityObserver?: IntersectionObserver;
  private localizedReviews: LocalizedReview[] = [];
  private languageSubscription?: Subscription;
  private autoSlideTimer?: ReturnType<typeof setInterval>;
  private currentIndex = 0;
  private currentVisibleCount = this.desktopVisibleCount;
  private transitionEnabled = true;

  carouselReviews: GoogleReview[] = [];

  constructor(
    private readonly http: HttpClient,
    private analytics: AnalyticsService,
    private elementRef: ElementRef<HTMLElement>,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.languageSubscription = this.languageService.language$.subscribe(
      (lang) => this.applyLanguageToReviews(lang)
    );
    this.loadCachedReviews();
  }

  ngAfterViewInit(): void {
    this.observeSection();
  }

  ngOnDestroy(): void {
    this.visibilityObserver?.disconnect();
    this.languageSubscription?.unsubscribe();
    this.stopAutoSlide();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (!this.reviews.length) {
      return;
    }
    this.updateVisibleCount();
  }

  get hasReviews(): boolean {
    return this.reviews.length > 0;
  }

  get canNavigate(): boolean {
    return this.reviews.length > this.currentVisibleCount;
  }

  get trackTransitionDuration(): string {
    return this.transitionEnabled ? '500ms' : '0ms';
  }

  get summaryTranslationKey(): string {
    if (this.isLoading) {
      return 'testimonials_summary_loading';
    }

    return this.hasReviews
      ? 'testimonials_summary_verified'
      : 'testimonials_summary_empty';
  }

  getStars(count?: number): number[] {
    const safeCount = this.normalizeRating(count);
    return Array.from({ length: safeCount });
  }

  trackByAuthor(index: number, review: GoogleReview): string {
    return `${index}-${review.author}-${review.date ?? ''}`;
  }

  onPrevClick(): void {
    if (!this.canNavigate) {
      return;
    }
    this.stopAutoSlide();
    this.prevSlide();
    this.startAutoSlide();
  }

  onNextClick(): void {
    if (!this.canNavigate) {
      return;
    }
    this.stopAutoSlide();
    this.nextSlide();
    this.startAutoSlide();
  }

  onTrackTransitionEnd(): void {
    if (!this.canNavigate) {
      return;
    }

    const buffer = Math.min(this.currentVisibleCount, this.reviews.length);
    const firstRealIndex = buffer;
    const lastRealIndex = buffer + this.reviews.length - 1;

    if (this.currentIndex > lastRealIndex) {
      this.jumpToIndex(firstRealIndex);
    } else if (this.currentIndex < firstRealIndex) {
      this.jumpToIndex(lastRealIndex);
    }
  }

  onLeaveReviewClick(): void {
    this.analytics.trackEvent('reviews_click_leave_review', {
      destination: 'google_reviews',
    });
  }

  onViewProfileClick(): void {
    this.analytics.trackEvent('reviews_click_view_profile', {
      destination: 'google_business_profile',
    });
  }

  private loadCachedReviews(): void {
    this.http
      .get<LocalizedReview[]>('assets/data/google-reviews.json', {
        headers: { 'Cache-Control': 'no-store' },
      })
      .pipe(catchError(() => of([] as LocalizedReview[])))
      .subscribe((cached) => {
        this.localizedReviews = this.normalizeCachedReviews(cached);
        if (this.localizedReviews.length) {
          this.applyLanguageToReviews(this.languageService.getCurrentLanguage());
          this.isLoading = false;
          this.maybeLogReviewsView();
          this.startAutoSlide();
        } else {
          this.fetchReviews();
        }
      });
  }

  private fetchReviews(): void {
    const config = this.getGoogleReviewsConfig();
    if (!config) {
      console.warn(
        'Testimonials section: missing Google Reviews configuration'
      );
      this.isLoading = false;
      this.reviews = [];
      this.maybeLogReviewsView();
      return;
    }

    this.isLoading = true;

    const lang = this.languageService.getCurrentLanguage();
    const url = `${this.googleApiUrl}/${config.placeId}`;
    const params = new HttpParams()
      .set('fields', 'reviews')
      .set('key', config.apiKey)
      .set('languageCode', lang);

    this.http
      .get<GooglePlaceReviewResponse>(url, {
        params,
        headers: { 'Cache-Control': 'no-store' },
      })
      .pipe(
        map((payload) => this.normalizeGooglePayload(payload, lang)),
        catchError((error) => {
          console.warn(
            'Testimonials section: unable to fetch Google reviews',
            error
          );
          return of([] as LocalizedReview[]);
        })
      )
      .subscribe((reviews) => {
        this.localizedReviews = reviews;
        this.applyLanguageToReviews(lang);
        this.isLoading = false;
        this.maybeLogReviewsView();
        this.startAutoSlide();
      });
  }

  private observeSection(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      this.sectionVisible = true;
      this.maybeLogReviewsView();
      return;
    }

    this.visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.sectionVisible = true;
            this.maybeLogReviewsView();
          }
        });
      },
      { threshold: 0.35 }
    );

    this.visibilityObserver.observe(this.elementRef.nativeElement);
  }

  private maybeLogReviewsView(): void {
    if (this.hasLoggedView || !this.sectionVisible || this.isLoading) {
      return;
    }
    this.hasLoggedView = true;
    this.analytics.trackEvent('reviews_view', {
      has_reviews: this.hasReviews,
    });
    this.visibilityObserver?.disconnect();
  }

  private getGoogleReviewsConfig(): GoogleReviewsConfig | null {
    const globalWindow = window as Window & {
      EASY_LOCKER_GOOGLE_API_KEY?: string;
      EASY_LOCKER_GOOGLE_PLACE_ID?: string;
    };

    const apiKey = globalWindow?.EASY_LOCKER_GOOGLE_API_KEY?.trim();
    const placeId = globalWindow?.EASY_LOCKER_GOOGLE_PLACE_ID?.trim();

    if (apiKey && placeId) {
      return { apiKey, placeId };
    }

    return null;
  }

  private normalizeGooglePayload(
    payload: GooglePlaceReviewResponse,
    lang: string
  ): LocalizedReview[] {
    if (!payload || payload.status === 'ZERO_RESULTS' || payload.status === 'NOT_FOUND') {
      return [];
    }

    const rawReviews = payload.reviews ?? [];

    return rawReviews
      .map((review) => ({
        author: review.authorAttribution?.displayName?.trim() || 'Google user',
        rating: this.normalizeRating(review.rating),
        date:
          review.relativePublishTimeDescription ||
          this.formatTimestamp(review.publishTime),
        original: {
          language: review.originalText?.languageCode || review.text?.languageCode || lang,
          text:
            review.originalText?.text?.trim() ||
            review.text?.text?.trim() ||
            '',
        },
        translations: {
          [lang]: review.text?.text?.trim() || review.originalText?.text?.trim() || '',
        },
      }))
      .filter((review) => !!review.translations[lang] && !!review.author)
      .map((review) => ({
        ...review,
        author: review.author.trim(),
      }))
      .slice(0, this.maxReviews);
  }

  private normalizeCachedReviews(source: LocalizedReview[] | undefined): LocalizedReview[] {
    if (!Array.isArray(source)) {
      return [];
    }

    return source
      .map((review, index) => ({
        author: review.author?.trim?.() || `cached-author-${index}`,
        rating: this.normalizeRating(review.rating),
        date: review.date,
        original: {
          language: review.original?.language,
          text: review.original?.text?.trim?.() || '',
        },
        translations: Object.fromEntries(
          Object.entries(review.translations || {}).map(([k, v]) => [k, v?.trim?.() || ''])
        ),
      }))
      .filter((review) => !!review.author)
      .slice(0, this.maxReviews);
  }

  private applyLanguageToReviews(lang: string): void {
    if (!this.localizedReviews.length) {
      return;
    }

    this.reviews = this.localizedReviews
      .map((review) => {
        const text =
          review.translations?.[lang] ||
          review.translations?.[review.original?.language ?? ''] ||
          review.original?.text ||
          '';

        return {
          author: review.author,
          text: text,
          rating: review.rating,
          date: review.date,
        } as GoogleReview;
      })
      .filter((review) => !!review.text && !!review.author);

    this.rebuildCarousel();
  }

  get slideWidthPercentage(): number {
    return 100 / this.currentVisibleCount;
  }

  get sliderTransform(): string {
    const offset = this.currentIndex * this.slideWidthPercentage;
    return `translateX(-${offset}%)`;
  }

  private prevSlide(): void {
    if (!this.canNavigate) {
      return;
    }
    this.transitionEnabled = true;
    this.currentIndex = this.currentIndex - 1;
  }

  private nextSlide(): void {
    if (!this.canNavigate) {
      return;
    }
    this.transitionEnabled = true;
    this.currentIndex = this.currentIndex + 1;
  }

  private startAutoSlide(): void {
    this.stopAutoSlide();
    if (!this.canNavigate) {
      return;
    }
    this.autoSlideTimer = setInterval(() => this.nextSlide(), this.autoSlideMs);
  }

  private stopAutoSlide(): void {
    if (this.autoSlideTimer) {
      clearInterval(this.autoSlideTimer);
      this.autoSlideTimer = undefined;
    }
  }

  private updateVisibleCount(): void {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const next = width < 768
      ? this.mobileVisibleCount
      : width < 1024
      ? this.tabletVisibleCount
      : this.desktopVisibleCount;

    if (next !== this.currentVisibleCount) {
      this.currentVisibleCount = next;
      this.rebuildCarousel();
    }
  }

  private rebuildCarousel(): void {
    if (!this.reviews.length) {
      this.carouselReviews = [];
      this.currentIndex = 0;
      this.transitionEnabled = true;
      return;
    }

    if (!this.canNavigate) {
      this.carouselReviews = [...this.reviews];
      this.currentIndex = 0;
      this.transitionEnabled = true;
      this.stopAutoSlide();
      return;
    }

    const buffer = Math.min(this.currentVisibleCount, this.reviews.length);
    const head = this.reviews.slice(0, buffer);
    const tail = this.reviews.slice(-buffer);
    this.carouselReviews = [...tail, ...this.reviews, ...head];

    this.transitionEnabled = false;
    this.currentIndex = buffer;
    setTimeout(() => {
      this.transitionEnabled = true;
      this.startAutoSlide();
    }, 0);
  }

  private jumpToIndex(index: number): void {
    this.transitionEnabled = false;
    this.currentIndex = index;
    setTimeout(() => {
      this.transitionEnabled = true;
    }, 0);
  }

  private normalizeRating(value?: number | string): number {
    if (value === undefined || value === null) {
      return 0;
    }

    const parsed = typeof value === 'string' ? parseFloat(value) : value;
    if (Number.isNaN(parsed)) {
      return 0;
    }

    return Math.max(0, Math.min(5, Math.round(parsed)));
  }

  private formatTimestamp(timestamp?: number | string): string | undefined {
    if (!timestamp) {
      return undefined;
    }

    try {
      const date = typeof timestamp === 'number' ? new Date(timestamp * 1000) : new Date(timestamp);
      return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch (error) {
      console.warn('Testimonials section: unable to format review date', error);
      return undefined;
    }
  }
}
