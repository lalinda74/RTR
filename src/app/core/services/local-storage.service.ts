import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  /**
   * Set value in localstorage
   * @param key key to be set in localstorage
   * @param value value to be set in localstorage
   */
  setItem(key: string, value: string | number): void {
    localStorage.setItem(key, String(value));
  }

  /**
   * Get value from localstorage
   * @param key key to be searched in localstorage
   * @returns localstorage value
   */
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  clearStorage(): void {
    localStorage.clear();
  }
}
