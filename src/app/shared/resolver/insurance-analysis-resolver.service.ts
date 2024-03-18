import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/service/api/api.service';
import { ApiUrl } from '../../core/constant/api.contant';

@Injectable({ providedIn: 'root' })
export class InsuranceAnalysisResolver implements Resolve<any> {
  constructor(
    private apiService: ApiService,
    private _router: Router
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const { id } = route.params;
    const params = route.queryParams;
    return new Promise((resolve) => {
      const url = ApiUrl.customerInsuranceAnalysis.replace(':id', id);
      this.apiService.get({
        url, params
      })?.subscribe((res: any) => {
        console.log('requestAnalysis res => ', res);
        const analysis = res;
        resolve(analysis);
      }, error => {
        console.log('requestAnalysis error =>', error);
        // alert('분석 결과를 불러오지 못했습니다.');
      });
    });
  }
}
