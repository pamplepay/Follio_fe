import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from '../../core/service/api/api.service';
import { ApiUrl } from '../../core/constant/api.contant';
import { take } from 'rxjs/operators';
import { DestroyService } from '../../core/service/destroy/destroy.service';

@Injectable({ providedIn: 'root' })
export class CustomerInsuranceResolver implements Resolve<any> {
  private subscription: Subscription;
  constructor(
    private apiService: ApiService,
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
    console.log('id', id);
    return new Promise((resolve) => {
      if (!id) {
        resolve(null);
        return;
      }

      const url = ApiUrl.getCustomerInsurance.replace(':id', id);
      this.subscription = this.apiService.get({
        url
      })?.subscribe((res: any) => {
        console.log('requestCustomerInsurance res => ', res);
        const customerInsurance = res;
        console.log('customerInsurance', customerInsurance);
        resolve(customerInsurance);
        this.subscription = null;
      }, error => {
        console.log('requestBookmark error =>', error);
        resolve(null);
        this.subscription = null;
      });
    });
  }
}
