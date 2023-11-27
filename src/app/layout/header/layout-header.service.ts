import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class LayoutHeaderService {
  header$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  rxHeader(): Observable<boolean> {
    return this.header$;
  }

  show(): void {
    this.header$.next(true);
  }

  hide(): void {
    this.header$.next(false);
  }
}
