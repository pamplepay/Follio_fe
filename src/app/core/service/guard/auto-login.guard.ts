import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ApiService } from '../api/api.service';
import { LocalStorageService } from '../../module/storage/local-storage.service';
import { SessionStorageService } from '../../module/storage/session-storage.service';
import { ApiUrl } from '../../constant/api.contant';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../../environments/environment';
import { AutoLogoutService } from '../auto-logout/auto-logout.service';

@Injectable({ providedIn: 'root' })
export class AutoLoginGuard implements CanActivate {
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private sessionStorage: SessionStorageService,
    private localStorage: LocalStorageService,
    private autoLogoutService: AutoLogoutService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // 자동 로그인 불러오는 로직을 넣어야 함.
    if (environment.isTesting === true) {
      // this.authService.login(mockLoginUser);
      return true;
    }

    if (this.authService.getLoginUser()) {
      return true;
    }

    const token = route.queryParams?.token || this.localStorage.get('token') || this.sessionStorage.get('token');
    if (!token) {
      return true;
    }

    this.apiService.setToken(token);

    return this.isLoginAfterRequestUser();
  }


  private isLoginAfterRequestUser(): Promise<boolean> {
    return new Promise((resolve) => {
      const url = ApiUrl.user;
      this.apiService?.get({ url })?.subscribe(loginUser => {
        console.log('requestUser res => ', loginUser);
        this.authService.login(loginUser);
        // this.autoLogoutService.initAutoLogout();

        resolve(true);
      }, error => {
        console.log('requestUser error =>', error);
        this.authService.logout();
        resolve(true);
      });
    })
  }
}
