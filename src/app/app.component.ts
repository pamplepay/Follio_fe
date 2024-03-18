import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/service/auth/auth.service';
import { FocusService } from './core/module/focus/focus.service';
import { LayoutToastService } from './layout/toast/layout-toast.service';
import { CommonService } from './core/service/common/common.service';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DestroyService } from './core/service/destroy/destroy.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private _authService: AuthService,
    private _focusService: FocusService,
    private _toastService: LayoutToastService,
    private _commonService: CommonService,
    private _router: Router,
    private _destroyService: DestroyService,
  ) {}

  ngOnInit(): void {
    this._authService.init();
    this._focusService.init();
    this._commonService.getInsurance();
    this._router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe((event: NavigationStart) => {
      this._destroyService.destroy();
    });

    this.clearProductionLog();
  }

  private clearProductionLog() {
    if (environment.name === 'prod') {
      console.log = () => {
      };
      console.error = () => {
      };
      console.warn = () => {
      };
      console.dir = () => {
      };
    }
  }
}
