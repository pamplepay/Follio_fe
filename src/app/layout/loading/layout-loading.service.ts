import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutLoadingService {
  loading$: Subject<any> = new Subject();

  isShow: boolean = false;
  constructor() {
  }

  rxLoading(): Observable<any> {
    return this.loading$;
  }

  show(type: 'screen' | 'over' | 'voca-test-new-loading' | 'voca-test-loading' | 'voca-test-continue-loading' | 'landing-test-loading' = 'over', data?: any): void {
    if (this.isShow === true) {
      return;
    }

    this.isShow = true;

    this.loading$.next({
      isShow: this.isShow,
      type,
      data
    });

  }

  hide(callback?: () => void): void {
    this.isShow = false;
    this.loading$.next({
      isShow: this.isShow
    });
    if (callback) {
      callback();
    }
  }
}
