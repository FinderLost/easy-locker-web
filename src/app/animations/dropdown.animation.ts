import { animate, style, transition, trigger } from '@angular/animations';

export const dropdownAnimation = trigger('dropdownAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-4px)' }),
    animate('180ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('160ms ease-in', style({ opacity: 0, transform: 'translateY(-4px)' }))
  ])
]);
