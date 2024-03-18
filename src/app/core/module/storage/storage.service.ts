import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: any = {};

  get(key: string): any {
    if (this.storage[key] instanceof Array) {
      return this.storage[key].slice();
    } else if (this.storage[key] instanceof Object) {
      return Object.assign({}, this.storage[key]);
    } else {
      return this.storage[key];
    }
  }

  set(key: string, value: any): void {
    if (value instanceof Array) {
      this.storage[key] = value.slice();
    } else if (value instanceof Object) {
      this.storage[key] = Object.assign({}, value);
    } else {
      this.storage[key] = value;
    }
  }

  remove(key: string): void {
    this.storage[key] = undefined;
  }

  getAll(): any {
    return Object.assign({}, this.storage);
  }

  setAll(data: any): any {
    this.storage = Object.assign({}, data);
  }

  clearAll(): void {
    this.storage = {};
  }
}
