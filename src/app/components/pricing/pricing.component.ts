import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from '../../core/analytics/analytics.service';

interface LockerPlan {
  id: 'M' | 'L' | 'XL';
  image: string;
  nameKey: string;
  priceKey: string;
  dimensionsKey: string;
  descriptionKey: string;
  sizeCm: string;
  link?: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css'],
})
export class PricingComponent implements OnInit, AfterViewInit, OnDestroy {
  private plansObserver?: IntersectionObserver;
  private hasLoggedView = false;
  bookingLink = '';
  plans: LockerPlan[] = [
    {
      id: 'M',
      image: 'assets/images/box-type-m.png',
      nameKey: 'lockerSizes.plans.m.name',
      priceKey: 'lockerSizes.plans.m.price',
      dimensionsKey: 'lockerSizes.plans.m.dimensions',
      descriptionKey: 'lockerSizes.plans.m.description',
      sizeCm: '28x41x56',
      width: 360,
      height: 360,
    },
    {
      id: 'L',
      image: 'assets/images/box-type-l.png',
      nameKey: 'lockerSizes.plans.l.name',
      priceKey: 'lockerSizes.plans.l.price',
      dimensionsKey: 'lockerSizes.plans.l.dimensions',
      descriptionKey: 'lockerSizes.plans.l.description',
      sizeCm: '50x41x56',
      width: 360,
      height: 360,
    },
    {
      id: 'XL',
      image: 'assets/images/box-type-xl.png',
      nameKey: 'lockerSizes.plans.xl.name',
      priceKey: 'lockerSizes.plans.xl.price',
      dimensionsKey: 'lockerSizes.plans.xl.dimensions',
      descriptionKey: 'lockerSizes.plans.xl.description',
      sizeCm: '82x41x56',
      width: 287,
      height: 360,
    },
  ];

  constructor(
    private analytics: AnalyticsService,
    private elementRef: ElementRef<HTMLElement>,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.translate.get('hero.links.reserve').subscribe((link: string) => {
      const trimmed = link?.trim() ?? '';
      this.bookingLink = trimmed;
      this.plans = this.plans.map((plan) => ({ ...plan, link: trimmed }));
    });
  }

  ngAfterViewInit(): void {
    this.observePlansSection();
  }

  ngOnDestroy(): void {
    this.plansObserver?.disconnect();
  }

  onPlanSelected(plan: LockerPlan): void {
    const planName = this.translate.instant(plan.nameKey);
    const payload = {
      plan_id: plan.id,
      plan_name: planName,
      plan_size_cm: plan.sizeCm,
      source: 'pricing_section',
      cta_variant: 'plan_card_cta',
    };

    this.analytics.trackEvent('plan_card_click', payload);

    // navigation handled by anchor element in template
  }

  onPlanClick(plan: LockerPlan): void {
    this.onPlanSelected(plan);
  }

  private observePlansSection(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      this.logPlansView('scroll');
      return;
    }

    this.plansObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.logPlansView('scroll');
          }
        });
      },
      { threshold: 0.35 }
    );

    this.plansObserver.observe(this.elementRef.nativeElement);
  }

  private logPlansView(method: 'scroll' | 'anchor_nav'): void {
    if (this.hasLoggedView) {
      return;
    }
    this.hasLoggedView = true;
    this.analytics.trackEvent('plans_view', { method });
    this.plansObserver?.disconnect();
  }
}
