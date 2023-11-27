import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from '../../core/service/api/api.service';
import { ApiUrl } from '../../core/constant/api.contant';
import { LayoutToastService } from '../../layout/toast/layout-toast.service';
import { AuthService } from '../../core/service/auth/auth.service';
import { DestroyService } from '../../core/service/destroy/destroy.service';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MyAnalysisResolver implements Resolve<any> {
  subscription: Subscription;
  constructor(
    private apiService: ApiService,
    private _authService: AuthService,
    private _toastService: LayoutToastService,
    private _router: Router,
    private _destroyService: DestroyService,
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    this._destroyService.rxDestroy().pipe(take(1)).subscribe(_ => {
      console.log('!!! destory MyAnalysisResolver', this.subscription);
      this.subscription?.unsubscribe();
    })
    const { id } = route.params;
    const params = route.queryParams;
    return new Promise((resolve) => {
      const url = ApiUrl.analysis.replace(':id', id);
      this.subscription = this.apiService.get({
        url, params
      })?.subscribe((res: any) => {
        console.log('requestAnalysis res => ', res, res.insurance_list[0].is_common);
        this.subscription = null;
        const analysis = res;
        if (analysis.insurance_list[0].is_common || analysis.insurance_list[0]?.user === this._authService?.getLoginUser()?.id) {
          resolve(analysis);
          return;
        } else {
          this._toastService.alert('잘못된 접근입니다.');
          this._router.navigateByUrl('');
          resolve(null);
        }
      }, error => {
        console.log('requestAnalysis error =>', error);
        this.subscription = null;
        // alert('분석 결과를 불러오지 못했습니다.');
        // this._router.navigateByUrl('customer/'+ id);
      });
    });
  }
}
