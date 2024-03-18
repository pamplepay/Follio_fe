import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from '../../core/service/api/api.service';
import { ApiUrl } from '../../core/constant/api.contant';
import { take } from 'rxjs/operators';
import { DestroyService } from '../../core/service/destroy/destroy.service';


@Injectable({ providedIn: 'root' })
export class MembershipListResolver implements Resolve<any> {
  private subscription: Subscription;
  constructor(
    private _destroyService: DestroyService,
    private _apiService: ApiService) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    this._destroyService.rxDestroy().pipe(take(1)).subscribe(_ => {
      console.log('!!! CompareResolver destroy', this.subscription);
      this.subscription?.unsubscribe();
    });
    return new Promise((resolve) => {
      const url = ApiUrl.membershipList;
      this.subscription = this._apiService.get({
        url
      }).subscribe((res: any) => {
        this.subscription = null;
        console.log('  res => ', res);
        resolve(res);
      }, error => {
        this.subscription = null;
        console.log('  error =>', error);
        resolve(null);
      });
    });
  }
}
