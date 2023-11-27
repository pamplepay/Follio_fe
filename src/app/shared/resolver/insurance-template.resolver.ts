import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from '../../core/service/api/api.service';
import { ApiUrl } from '../../core/constant/api.contant';
import { take } from 'rxjs/operators';
import { DestroyService } from '../../core/service/destroy/destroy.service';

@Injectable({ providedIn: 'root' })
export class InsuranceTemplateResolver implements Resolve<any> {
  private subscription: Subscription;
  constructor(
    private apiService: ApiService,
    private _destroyService: DestroyService,
    private _router: Router
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
      const url = ApiUrl.getCustomerInsurance.replace(':id', id);
      this.subscription = this.apiService.get({
        url
      })?.subscribe((res: any) => {
        console.log('requestBookmark res => ', res);
        this.subscription = null;
        const insuranceTemplate = res;
        console.log('insuranceTemplate', insuranceTemplate);
        resolve(insuranceTemplate);
      }, error => {
        this.subscription = null;
        console.log('requestBookmark error =>', error);
      });
    });
  }
}
