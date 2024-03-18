import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DestroyService {

  private destroy$ = new Subject<boolean>();

  constructor() {
  }

  rxDestroy(): Observable<boolean> {
    return this.destroy$
  }

  destroy(): void {
    this.destroy$.next(true);
  }
}
