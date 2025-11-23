import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { AnalyticsService } from '../../core/analytics/analytics.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements AfterViewInit, OnDestroy {
  faqs = [
    { questionKey: 'faq_q1', answerKey: 'faq_a1', isOpen: false },
    { questionKey: 'faq_q2', answerKey: 'faq_a2', isOpen: false },
    { questionKey: 'faq_q3', answerKey: 'faq_a3', isOpen: false },
    { questionKey: 'faq_q4', answerKey: 'faq_a4', isOpen: false },
    { questionKey: 'faq_q5', answerKey: 'faq_a5', isOpen: false },
    { questionKey: 'faq_q6', answerKey: 'faq_a6', isOpen: false },
    { questionKey: 'faq_q7', answerKey: 'faq_a7', isOpen: false },
    { questionKey: 'faq_q8', answerKey: 'faq_a8', isOpen: false },
    { questionKey: 'faq_q9', answerKey: 'faq_a9', isOpen: false }
  ];

  private hasLoggedView = false;
  private observer?: IntersectionObserver;

  constructor(
    private analytics: AnalyticsService,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngAfterViewInit(): void {
    this.observeFaqSection();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  toggleFaq(index: number): void {
    const faq = this.faqs[index];
    faq.isOpen = !faq.isOpen;
    this.analytics.logEvent('faq_toggle', {
      faq_id: index,
      faq_question_key: faq.questionKey,
      is_open: faq.isOpen,
    });
  }

  private observeFaqSection(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      this.logFaqView();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.logFaqView();
          }
        });
      },
      { threshold: 0.3 }
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  private logFaqView(): void {
    if (this.hasLoggedView) {
      return;
    }
    this.hasLoggedView = true;
    this.analytics.logEvent('faq_view', {
      faq_count: this.faqs.length,
    });
    this.observer?.disconnect();
  }
}
