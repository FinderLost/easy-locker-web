import { Component } from '@angular/core';

interface LockerPlan {
  image: string;
  nameKey: string;
  dimensionsKey: string;
  descriptionKey: string;
}

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css'],
})
export class PricingComponent {
  plans: LockerPlan[] = [
    {
      image: 'assets/images/box-type-m.png',
      nameKey: 'lockerSizes.plans.m.name',
      dimensionsKey: 'lockerSizes.plans.m.dimensions',
      descriptionKey: 'lockerSizes.plans.m.description',
    },
    {
      image: 'assets/images/box-type-l.png',
      nameKey: 'lockerSizes.plans.l.name',
      dimensionsKey: 'lockerSizes.plans.l.dimensions',
      descriptionKey: 'lockerSizes.plans.l.description',
    },
    {
      image: 'assets/images/box-type-xl.png',
      nameKey: 'lockerSizes.plans.xl.name',
      dimensionsKey: 'lockerSizes.plans.xl.dimensions',
      descriptionKey: 'lockerSizes.plans.xl.description',
    },
  ];
}
