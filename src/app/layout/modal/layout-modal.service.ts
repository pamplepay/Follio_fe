import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutModalService {
  modal$: Subject<any> = new Subject();

  isOpen: boolean = false;

  params: any;

  index: number = -1;

  constructor() {
  }

  rxModal(): Observable<any> {
    return this.modal$;
  }

  create(component: any, params?: any, index: number = -1): any {
    this.isOpen = true;

    if (params) {
      this.params = params;
    }

    if (index !== -1) {
      this.index = index;
    }

    const createModalParams = {
      isOpen:    this.isOpen,
      component,
      params
    };

    this.modal$.next(createModalParams);

    return createModalParams;
  }

  dismiss(callback?: (index: number) => void): void {
    this.isOpen = false;
    this.modal$.next({
      isOpen: this.isOpen
    });
    if (callback) {
      callback(this.index);
    }
  }
}
