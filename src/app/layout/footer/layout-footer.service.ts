import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LayoutFooterService {
  footer$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  rxFooter(): Observable<boolean> {
    return this.footer$;
  }

  show(): void {
    this.footer$.next(true);
  }

  hide(): void {
    this.footer$.next(false);
  }
}
