import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private readonly ACCESS_CODE = '9BD60AF8C';
  private readonly STORAGE_KEY = 'access_granted';

  constructor() { }

  /**
   * Verifica si el código de acceso es válido
   */
  validateAccessCode(code: string): boolean {
    return code === this.ACCESS_CODE;
  }

  /**
   * Guarda el estado de acceso en sessionStorage
   */
  grantAccess(): void {
    sessionStorage.setItem(this.STORAGE_KEY, 'true');
  }

  /**
   * Verifica si el usuario tiene acceso concedido
   */
  hasAccess(): boolean {
    return sessionStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  /**
   * Revoca el acceso
   */
  revokeAccess(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }
}
