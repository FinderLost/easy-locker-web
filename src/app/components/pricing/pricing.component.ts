import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from '../../core/analytics/analytics.service';

interface LockerPlan {
  id: 'M' | 'L' | 'XL';
  image: string;
  nameKey: string;
  dimensionsKey: string;
  descriptionKey: string;
  sizeCm: string;
}

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css'],
})
export class PricingComponent implements AfterViewInit, OnDestroy {
  private plansObserver?: IntersectionObserver;
  private hasLoggedView = false;
  plans: LockerPlan[] = [
    {
      id: 'M',
      image: 'assets/images/box-type-m.png',
      nameKey: 'lockerSizes.plans.m.name',
      dimensionsKey: 'lockerSizes.plans.m.dimensions',
      descriptionKey: 'lockerSizes.plans.m.description',
      sizeCm: '28x41x56',
    },
    {
      id: 'L',
      image: 'assets/images/box-type-l.png',
      nameKey: 'lockerSizes.plans.l.name',
      dimensionsKey: 'lockerSizes.plans.l.dimensions',
      descriptionKey: 'lockerSizes.plans.l.description',
      sizeCm: '50x41x56',
    },
    {
      id: 'XL',
      image: 'assets/images/box-type-xl.png',
      nameKey: 'lockerSizes.plans.xl.name',
      dimensionsKey: 'lockerSizes.plans.xl.dimensions',
      descriptionKey: 'lockerSizes.plans.xl.description',
      sizeCm: '82x41x56',
    },
  ];

  constructor(
    private analytics: AnalyticsService,
    private elementRef: ElementRef<HTMLElement>,
    private translate: TranslateService
  ) {}

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

    this.analytics.logEvent('plan_card_click', payload);

    this.translate
      .get('hero.links.reserve')
      .subscribe((link: string) => {
        const target = link?.trim();
        if (!target || typeof window === 'undefined') {
          return;
        }
        window.open(target, '_blank');
      });
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
    this.analytics.logEvent('plans_view', { method });
    this.plansObserver?.disconnect();
  }
}
