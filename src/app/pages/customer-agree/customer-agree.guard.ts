import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../core/service/api/api.service';
import { ApiUrl } from '../../core/constant/api.contant';
import { LayoutHeaderService } from '../../layout/header/layout-header.service';
import { LayoutFooterService } from '../../layout/footer/layout-footer.service';

@Injectable({ providedIn: 'root' })
export class CustomerAgreeGuard implements CanActivate {
  private SGetCustomerRequest: Subscription | undefined;
  constructor(
    private _apiService: ApiService,
    private _router: Router,
    private _headerService: LayoutHeaderService,
    private _footerService: LayoutFooterService
  ) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this._headerService.hide();
    this._footerService.hide();
    const id       = route.params?.id;
    const customer: any = await this._requestGetCustomer(id);
    if (!customer || customer?.is_agree_term) {
      return false;
    }

    return true;
  }

  private _requestGetCustomer(id) {
    return new Promise((r) => {
      if (this.SGetCustomerRequest) { // 연속 처리 방지
        return;
      }

      const url = ApiUrl.getCustomer.replace(':id', id);
      this.SGetCustomerRequest = this._apiService.get({
        url
      }).subscribe(res => {
        console.log('requestGetCustomer res => ', res);
        if (res) {
          r(res);
        } else {
          r(null);
        }
        this.SGetCustomerRequest = null;
      }, error => {
        console.log('requestGetCustomer error =>', error);
        r(null);
        this.SGetCustomerRequest = null;
      });
    })

  }
}
