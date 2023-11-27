import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from '../../core/service/api/api.service';
import { ApiUrl } from '../../core/constant/api.contant';
import { DestroyService } from '../../core/service/destroy/destroy.service';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnalysisResolver implements Resolve<any> {
  subscription: Subscription;

  constructor(
    private apiService: ApiService,
    private _router: Router,
    private _destroyService: DestroyService
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    this._destroyService.rxDestroy().pipe(take(1)).subscribe(_ => {
      console.log('!!! AnalysisResolver destroy', this.subscription);
      this.subscription?.unsubscribe();
    });

    const { id } = route.params;
    const params = route.queryParams;
    return new Promise((resolve) => {
      const url = ApiUrl.analysis.replace(':id', id);
      this.subscription = this.apiService.get({
        url,
        params
      })?.subscribe((res: any) => {
        this.subscription = null;
        console.log('requestAnalysis res => ', res);
        const analysis = res;
        resolve(analysis);
      }, error => {
        console.log('requestAnalysis error =>', error);
        // alert('분석 결과를 불러오지 못했습니다.');
        this.subscription = null;
        // this._router.navigateByUrl('customer/'+ id);
      });
    });
  }
}
