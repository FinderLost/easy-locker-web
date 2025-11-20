import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DropdownCoordinatorService {
  private readonly openDropdownSubject = new BehaviorSubject<string | null>(null);
  readonly openDropdown$ = this.openDropdownSubject.asObservable();

  toggle(dropdownId: string): void {
    const current = this.openDropdownSubject.value;
    this.openDropdownSubject.next(current === dropdownId ? null : dropdownId);
  }

  close(dropdownId: string): void {
    if (this.openDropdownSubject.value === dropdownId) {
      this.openDropdownSubject.next(null);
    }
  }

  forceCloseAll(): void {
    this.openDropdownSubject.next(null);
  }
}
