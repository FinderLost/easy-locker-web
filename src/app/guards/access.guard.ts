import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AccessService } from '../services/access.service';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {

  constructor(
    private accessService: AccessService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Check for access code in URL
    const code = route.queryParams['cod'];
    if (code && this.accessService.validateAccessCode(code)) {
      this.accessService.grantAccess();
      // Remove the code from URL
      this.router.navigate(['/'], { queryParams: {} });
      return true;
    }

    // Check if access was already granted
    if (this.accessService.hasAccess()) {
      return true;
    }
    
    this.router.navigate(['/coming-soon']);
    return false;
  }
}
