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
export class MyInsuranceAnalysisResolverService implements Resolve<any> {
  private subscription: Subscription;

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
      console.log('!!! CompareResolver destroy', this.subscription);
      this.subscription?.unsubscribe();
    });

    const { id } = route.params;
    const params = route.queryParams;
    return new Promise((resolve) => {
      const url = ApiUrl.customerInsuranceAnalysis.replace(':id', id);
      this.subscription =this.apiService.get({
        url, params
      })?.subscribe((res: any) => {
        console.log('requestAnalysis res => ', res);
        this.subscription = null;
        const analysis = res;
        if (analysis.insurance_list[0]?.is_common || analysis.insurance_list[0]?.user === this._authService?.getLoginUser()?.id) {
          resolve(analysis);
          return;
        } else {
          this._toastService.alert('잘못된 접근입니다.');
          this._router.navigateByUrl('');
          this.subscription = null;
          resolve(null);
        }
      }, error => {
        console.log('requestAnalysis error =>', error);
        // alert('분석 결과를 불러오지 못했습니다.');
      });
    });
  }
}
