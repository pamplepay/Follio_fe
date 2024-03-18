import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private isMobile$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private breakpoint: BreakpointObserver
  ) {

    this.breakpoint.observe([
      '(max-width: 699px)'
    ]).subscribe(result => {
      this.isMobile$.next(result.matches);
    });
  }

  rxIsMobile(): Observable<boolean> {
    return this.isMobile$
  }
}
