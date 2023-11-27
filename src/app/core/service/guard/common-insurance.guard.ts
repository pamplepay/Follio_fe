import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { CommonService } from '../common/common.service';
import { LayoutLoadingService } from '../../../layout/loading/layout-loading.service';

@Injectable({ providedIn: 'root' })
export class CommonInsuranceGuard implements CanActivate {
  constructor(
    private _commonService: CommonService,
    private _loadingService: LayoutLoadingService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return new Promise<boolean>(r => {
      this._commonService.rxInsurance().subscribe(insurance => {
        if (insurance) {
          this._loadingService.hide();
          r(true);
        } else {
          setTimeout(() => {
            this._loadingService.show();
          },100);
        }
      });
    });
  }
}
