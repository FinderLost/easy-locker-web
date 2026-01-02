import { Injectable } from '@angular/core';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { environment } from '../../../environments/environment';
import { LockerPrices, normalizeLockerPrices } from '../constants/locker-prices';

@Injectable({ providedIn: 'root' })
export class PricesService {
  private app: FirebaseApp | null = null;
  private pricesPromise?: Promise<LockerPrices>;

  private ensureApp(): FirebaseApp {
    if (typeof window === 'undefined') {
      throw new Error('[Prices] Firestore is unavailable on the server');
    }

    if (this.app) {
      return this.app;
    }

    const existing = getApps();
    this.app = existing.length ? getApp() : initializeApp(environment.firebaseConfig);
    return this.app;
  }

  fetchPrices(): Promise<LockerPrices> {
    if (this.pricesPromise) {
      return this.pricesPromise;
    }

    this.pricesPromise = this.loadPrices();
    return this.pricesPromise;
  }

  private async loadPrices(): Promise<LockerPrices> {
    const app = this.ensureApp();
    const db = getFirestore(app);
    const ref = doc(db, 'config', 'prices');
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      throw new Error('[Prices] Firestore document config/prices not found');
    }

    const data = snap.data() as Record<string, unknown>;
    return normalizeLockerPrices(data);
  }
}
