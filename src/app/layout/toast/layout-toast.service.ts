import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ToastParams } from './layout-taost.model';
import { BasicToastComponent } from './basic-toast/basic-toast.component';


@Injectable()
export class LayoutToastService {
  toast$: Subject<ToastParams> = new Subject();

  constructor() {
  }

  rxToast(): Observable<any> {
    return this.toast$;
  }

  create({ component, data = {}, during = 3000 }: { component: any, data?: any, during: number }): any {
    const id     = Symbol('toast');
    const isShow = true;

    const createToastParams = {
      id,
      isShow,
      component,
      data
    };

    this.toast$.next(createToastParams);

    setTimeout(() => {
      this.dismiss(id);
    }, during);

    return createToastParams;
  }

  dismiss(id: symbol, callback?: () => void): void {
    const isShow = false;

    this.toast$.next({
      id,
      isShow,
      callback
    });
  }

  alert(message: string): void {
    if (message === '') {
      return;
    }

    const id     = Symbol('toast');
    const isShow = true;
    const component = BasicToastComponent;
    const data = {
      message
    };

    const createToastParams = {
      id,
      isShow,
      component,
      data
    };

    this.toast$.next(createToastParams);

    setTimeout(() => {
      this.dismiss(id);
    }, 3000);
  }
}
