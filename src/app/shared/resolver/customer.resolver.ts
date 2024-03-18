import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from '../../core/service/api/api.service';
import { ApiUrl } from '../../core/constant/api.contant';
import { AuthService } from '../../core/service/auth/auth.service';
import { LayoutToastService } from '../../layout/toast/layout-toast.service';
import { DestroyService } from '../../core/service/destroy/destroy.service';
import { take } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class CustomerResolver implements Resolve<any> {
  subscription: Subscription;

  constructor(
    private _apiService: ApiService,
    private _toastService: LayoutToastService,
    private _authService: AuthService,
    private _router: Router,
    private _destroyService: DestroyService
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    this._destroyService.rxDestroy().pipe(take(1)).subscribe(_ => {
      console.log('CustomerResolver destroy', this.subscription);
      this.subscription?.unsubscribe();
    });
    const id = route.params.id;
    return new Promise((resolve) => {
      const url         = ApiUrl.getCustomer.replace(':id', id);
      this.subscription = this._apiService.get({
        url
      }).subscribe((res: any) => {
        console.log('CustomerResolver res => ', res);
        this.subscription = null;
        if (this._authService.getLoginUser().id !== res.user) {
          resolve(null);
          this._toastService.alert('잘못된 접근입니다.');
          this._router.navigateByUrl('customer');
          return;
        }
        resolve(res);
      }, error => {
        console.log('CustomerResolver error =>', error);
        this.subscription = null;
        resolve(null);
      });
    });
  }
}
