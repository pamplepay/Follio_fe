import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storage: Storage | null = null;

  private storageType: string = 'localStorage';

  private prefix: string = `${ environment.projectName }_${ environment.name }_`;

  private isSupport: boolean = false;

  constructor() {
    this._setLocalStorage();
  }

  get(key: string, prefix?: string): any {
    if (this.isSupport) {
      const deriveKey = this._deriveKey(key, prefix);
      let storageResult;
      const data = this.storage?.getItem(deriveKey);
      if (data) {
        storageResult = JSON.parse(data);
      }
      return storageResult;
    }
  }

  set(key: string, value: any, prefix?: string): void {
    if (this.isSupport) {
      const deriveKey = this._deriveKey(key, prefix);
      this.storage?.setItem(deriveKey, JSON.stringify(value));
    }
  }

  remove(key: string, prefix?: string): void {
    if (this.isSupport) {
      const deriveKey = this._deriveKey(key, prefix);
      this.storage?.removeItem(deriveKey);
    }
  }

  clear(key: string, prefix?: string): void {
    if (this.isSupport) {
      for (const localKey in this.storage) {
        const derivedKey = this._deriveKey(key, prefix);
        if (localKey === derivedKey) {
          this.storage?.removeItem(derivedKey);
          break;
        }
      }
    }
  }

  clearAll(prefix?: string): void {
    if (this.isSupport) {
      for (const key in this.storage) {
        if (key.indexOf(prefix || this.prefix) === 0) {
          this.storage?.removeItem(key);
        }
      }
    }
  }

  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  private _deriveKey(key: string, prefix?: string): string {
    if (prefix === undefined || prefix === null) {
      return `${ this.prefix }${ key }`;
    } else {
      return `${ prefix }${ key }`;
    }
  }

  private _setLocalStorage(): void {

    if (window && window[this.storageType as any] !== undefined) {
      this.storage   = window[this.storageType as any] as any;
      this.isSupport = true;
    } else {
      this.isSupport = false;
    }
  }
}
