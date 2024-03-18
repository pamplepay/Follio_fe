import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutHeaderService } from './layout-header.service';
import { AuthService } from '../../core/service/auth/auth.service';
import { IUser } from '../../core/model/auth.model';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { LayoutToastService } from '../toast/layout-toast.service';
import { debounceTime, filter } from 'rxjs/operators';

@AutoUnsubscribe()
@Component({
  selector:    'app-layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls:   [ './layout-header.component.scss' ]
})
export class LayoutHeaderComponent implements OnInit, OnDestroy {
  header$: Observable<boolean>;
  loginUser$: Observable<IUser>;
  nav: string = '';

  constructor(
    private _router: Router,
    private _headerService: LayoutHeaderService,
    private _authService: AuthService,
    private _toastService: LayoutToastService
  ) {
  }

  ngOnInit(): void {
    this._router.events.pipe(
      filter(event => event instanceof NavigationStart),
    ).subscribe((value: any) => {
      const url = value?.url;
      const urlList = url.split('/');
      this.nav = urlList?.[1] || '';
    });
    this.header$    = this._headerService.rxHeader();
    this.loginUser$ = this._authService.rxLoginUser();
  }

  ngOnDestroy(): void {
  }

  /******************************     event functions     ****************************/

  onGotoPage(route): void {

    if (route === 'insurance') {
      this._toastService.alert('개발중 입니다.');
      return;
    }

    this._router.navigateByUrl(route);
  }
}
