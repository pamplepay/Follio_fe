import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from '../../core/service/api/api.service';
import { ApiUrl } from '../../core/constant/api.contant';
import { AuthService } from '../../core/service/auth/auth.service';
import { LayoutToastService } from '../../layout/toast/layout-toast.service';
import { take } from 'rxjs/operators';
import { DestroyService } from '../../core/service/destroy/destroy.service';

@Injectable({ providedIn: 'root' })
export class MyCompareResolver implements Resolve<any> {
  private subscription: Subscription;

  constructor(
    private apiService: ApiService,
    private _authService: AuthService,
    private _toastService: LayoutToastService,
    private _router: Router,
    private _destroyService: DestroyService
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    this._destroyService.rxDestroy().pipe(take(1)).subscribe(_ => {
      console.log('!!! CompareResolver destroy', this.subscription);
      this.subscription?.unsubscribe();
    });

    const { id } = route.params;
    return new Promise((resolve) => {
      const url = ApiUrl.compare.replace(':id', id);
      this.subscription = this.apiService.get({
        url
      })?.subscribe((res: any) => {
        console.log('requestCompare res => ', res);
        this.subscription = null;
        const compare     = res;
        if (compare.customer.user === this._authService?.getLoginUser()?.id) {
          resolve(compare);
        } else {
          this._toastService.alert('잘못된 접근입니다.');
          this._router.navigateByUrl('');
          resolve(null);
          return;
        }
      }, error => {
        console.log('requestCompare error =>', error);
        this.subscription = null;
        // alert('분석 결과를 불러오지 못했습니다.');
        this._router.navigateByUrl('customer/' + id);
      });
    });
  }
}
