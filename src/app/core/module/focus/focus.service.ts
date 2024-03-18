import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FocusService {
  private focus$: Subject<string | null> = new Subject();
  private focus: string | null = null;

  constructor() {}

  init(): void {
    // 글로벌하게 click 이벤트를 확인하고 focus를 null로 만듭니다.
    fromEvent(document, 'click').subscribe(event => {
      this.setFocus(null);
    });
  }

  rxFocus(): Observable<any> {
    return this.focus$;
  }

  setFocus(focus: string | null): void {
    this.focus = focus;
    this.focus$.next(focus);
  }

  getFocus(): string | null {
    return this.focus;
  }
}
