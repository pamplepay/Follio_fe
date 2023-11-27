import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GlobalScrollService {
  private scroll$: Subject<any>;

  constructor() {
  }

  init(): void {
    this.scroll$ = new Subject<any>();

    document.addEventListener('scroll', (event: any) => {
      const offsetHeight = event.target.scrollingElement.offsetHeight;
      const scrollHeight = event.target.scrollingElement.scrollHeight;
      const scrollTop = event.target.scrollingElement.scrollTop;
      this.scroll$.next({
        scrollTop,
        scrollHeight,
        offsetHeight
      });
    });
  }

  rxScroll(): Observable<any> {
    return this.scroll$;
  }

  getRequestTop(event, itemHeight): number {

    return event.scrollHeight - event.offsetHeight - itemHeight;
  }
}
