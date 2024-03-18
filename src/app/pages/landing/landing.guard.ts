import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class LandingGuard implements CanActivate {
  constructor(
    private _authService: AuthService,
    private _router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this._authService.getLoginUser()) {
      this._router.navigateByUrl('main');
      return false;
    }

    return true;
  }
}
