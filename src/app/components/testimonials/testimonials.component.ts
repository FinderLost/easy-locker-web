import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { AnalyticsService } from '../../core/analytics/analytics.service';

interface GoogleReview {
  author: string;
  text: string;
  rating?: number;
  date?: string;
}

interface GooglePlaceReviewResponse {
  reviews?: Array<{
    authorAttribution?: { displayName?: string };
    rating?: number;
    relativePublishTimeDescription?: string;
    publishTime?: string;
    originalText?: { text?: string };
    text?: { text?: string };
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

  reviews: GoogleReview[] = [];
  isLoading = true;
  private hasLoggedView = false;
  private sectionVisible = false;
  private visibilityObserver?: IntersectionObserver;

  constructor(
    private readonly http: HttpClient,
    private analytics: AnalyticsService,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.loadCachedReviews();
  }

  ngAfterViewInit(): void {
    this.observeSection();
  }

  ngOnDestroy(): void {
    this.visibilityObserver?.disconnect();
  }

  get hasReviews(): boolean {
    return this.reviews.length > 0;
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
    return `${review.author}-${review.date ?? index}`;
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
      .get<GoogleReview[]>('assets/data/google-reviews.json', {
        headers: { 'Cache-Control': 'no-store' },
      })
      .pipe(catchError(() => of([] as GoogleReview[])))
      .subscribe((cached) => {
        const normalized = this.normalizeCachedReviews(cached);
        if (normalized.length) {
          this.reviews = normalized;
          this.isLoading = false;
          this.maybeLogReviewsView();
          return;
        }

        this.fetchReviews();
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

    const url = `${this.googleApiUrl}/${config.placeId}`;
    const params = new HttpParams().set('fields', 'reviews').set('key', config.apiKey);

    this.http
      .get<GooglePlaceReviewResponse>(url, {
        params,
        headers: { 'Cache-Control': 'no-store' },
      })
      .pipe(
        map((payload) => this.normalizeGooglePayload(payload)),
        catchError((error) => {
          console.warn(
            'Testimonials section: unable to fetch Google reviews',
            error
          );
          return of([] as GoogleReview[]);
        })
      )
      .subscribe((reviews) => {
        this.reviews = reviews;
        this.isLoading = false;
        this.maybeLogReviewsView();
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
    payload: GooglePlaceReviewResponse
  ): GoogleReview[] {
    if (!payload || payload.status === 'ZERO_RESULTS' || payload.status === 'NOT_FOUND') {
      return [];
    }

    const rawReviews = payload.reviews ?? [];

    return rawReviews
      .map((review) => ({
        author: review.authorAttribution?.displayName?.trim() || 'Google user',
        text:
          review.originalText?.text?.trim() ||
          review.text?.text?.trim() ||
          '',
        rating: this.normalizeRating(review.rating),
        date:
          review.relativePublishTimeDescription ||
          this.formatTimestamp(review.publishTime),
      }))
      .filter((review) => !!review.text && !!review.author)
      .map((review) => ({
        author: review.author.trim(),
        text: review.text.trim(),
        rating: this.normalizeRating(review.rating),
        date: review.date,
      }))
      .slice(0, this.maxReviews);
  }

  private normalizeCachedReviews(source: GoogleReview[] | undefined): GoogleReview[] {
    if (!Array.isArray(source)) {
      return [];
    }

    return source
      .map((review, index) => ({
        author: review.author?.trim?.() || `cached-author-${index}`,
        text: review.text?.trim?.() || '',
        rating: this.normalizeRating(review.rating),
        date: review.date,
      }))
      .filter((review) => !!review.author && !!review.text)
      .slice(0, this.maxReviews);
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
