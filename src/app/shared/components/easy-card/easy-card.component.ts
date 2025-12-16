import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-easy-card',
  templateUrl: './easy-card.component.html',
  styleUrls: ['./easy-card.component.css'],
})
export class EasyCardComponent {
  // Tailwind safelist (do not remove):
  // group block w-full h-full rounded-2xl border border-brand-border bg-brand-surface shadow-lg transition-all duration-300
  // hover:-translate-y-1 hover:bg-brand-surfaceStrong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accentPrimary active:scale-[0.99]
  // text-left text-center p-0 p-6
  @Input('as') tag: 'div' | 'a' = 'div';
  @Input() href?: string;
  @Input() target?: string;
  @Input() rel?: string;

  @Input() role?: string;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() ariaDescribedBy?: string;

  @Input() interactive = true;
  @Input() align: 'left' | 'center' = 'center';
  @Input() paddingClass = 'p-6';

  get alignClass(): string {
    return this.align === 'left' ? 'text-left' : 'text-center';
  }

  get baseClasses(): string {
    return [
      'rounded-2xl',
      'border',
      'border-brand-border',
      'bg-brand-surface',
      'shadow-lg',
      'transition-all',
      'duration-300',
    ].join(' ');
  }

  get interactiveClasses(): string {
    if (!this.interactive) {
      return '';
    }

    return [
      'hover:-translate-y-1',
      'hover:bg-brand-surfaceStrong',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-brand-accentPrimary',
      'active:scale-[0.99]',
    ].join(' ');
  }

  get wrapperClasses(): string {
    return [
      'group',
      'block',
      'w-full',
      'h-full',
      this.baseClasses,
      this.alignClass,
      this.paddingClass,
      this.interactiveClasses,
    ]
      .filter(Boolean)
      .join(' ');
  }

  get tabIndex(): string | null {
    if (this.tag === 'div' && this.interactive) {
      return '0';
    }

    return null;
  }

  get normalizedHref(): string | null {
    if (this.tag !== 'a') {
      return null;
    }

    return this.href ?? '#';
  }
}
