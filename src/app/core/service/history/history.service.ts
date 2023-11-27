import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LocationStrategy } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(
    private _location: LocationStrategy,
    private _router: Router) {
  }

  init(): void {
    this._router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this._location.replaceState({page: window.history.length}, document.title, window.location.pathname, '');
    });
  }
}
