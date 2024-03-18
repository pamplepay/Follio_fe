import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SessionStorageService } from '../../module/storage/session-storage.service';
import { IUser } from '../../model/auth.model';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../module/storage/local-storage.service';
import { environment } from '../../../../environments/environment';
import { LayoutToastService } from '../../../layout/toast/layout-toast.service';
import { AlertModalComponent } from '../../../shared/modals/alert/alert-modal.component';
import { LayoutModalService } from '../../../layout/modal/layout-modal.service';
import { ApiUrl } from '../../constant/api.contant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private redirectUrl: string | null = null;

  private loginUser: IUser | null = null;

  private loginUser$ = new BehaviorSubject<IUser | null>(null);

  constructor(
    private apiService: ApiService,
    private sessionStorage: SessionStorageService,
    private localStorage: LocalStorageService,
    private router: Router,
    private _modalService: LayoutModalService,
    private _toastService: LayoutToastService,
  ) {
  }

  init(): void {
    // const loginUser = this.sessionStorage.get('loginUser');
    //
    // // 자동 로그인 구현
    // if (!loginUser) {
    //   const loginUserKey = this.localStorage.get('loginUserKey');
    //   // 프로필 api 호출 로그인 시키기.
    //   this.apiService.setKey(loginUserKey);
    // }
    //
    // this.login(loginUser);
    // if (environment.production) {
    //   const loginUser = {
    //     created_at: '2020-03-04 14:10:44',
    //     email:      'tahooki12@gmail.com',
    //     id:         16,
    //     image:      null,
    //     key:        '8284ee897e4f3e5500d79465d52a156fe382ae39',
    //     name:       '김태훈',
    //     updated_at: '2020-03-04 14:10:44'
    //   };
    //
    //   this.login(loginUser);
    // } else {
    //   const loginUser = {
    //     created_at: '2020-09-10 10:31:07',
    //     email:      'tahooki@naver.com',
    //     id:         20,
    //     image:      null,
    //     key:        '52ec91a79d96ed2846756a2760e764e4bef4e8d2',
    //     name:       '김태훈',
    //     updated_at: '2020-09-10 10:31:07'
    //   };
    //   this.login(loginUser);
    // }
  }

  rxLoginUser(): Observable<any> {
    return this.loginUser$;
  }

  login(loginUser: IUser): void {
    if (!loginUser) {
      return;
    }

    this.loginUser = loginUser;
    this.apiService.setToken(loginUser.key);
    this.sessionStorage.set('token', loginUser.key);

    // Todo: 수정해야함
    // this.apiService.setToken('a4a7c08a2cc9b466b923e0009b988e07e8dfd6b2');
    // this.sessionStorage.set('token', 'a4a7c08a2cc9b466b923e0009b988e07e8dfd6b2');

    this.loginUser$.next(loginUser);
  }

  updateLoginUser(loginUser: IUser): void {
    this.loginUser = loginUser;
    this.loginUser$.next(loginUser);
  }

  setAutoLogin(token: string | null): void {
    this.localStorage.set('token', token);
  }

  getLoginUser(): IUser | null {
    return this.loginUser;
  }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string | null {
    return this.redirectUrl;
  }

  logout(): void {
    if (environment.isTesting === true) {
      this.router.navigateByUrl('login');
      return;
    }

    this.loginUser = null;
    this.apiService.setToken(null);
    this.localStorage.clearAll();
    this.sessionStorage.clearAll();
    this.loginUser$.next(null);
    this.router.navigateByUrl('login');
    this._toastService.alert('로그아웃 되었습니다.');
  }

  checkLogin(redirectUrl: string = this.router.url): boolean {
    if (!this.loginUser) {
      this._modalService.create(AlertModalComponent, {
        title: '로그인',
        body: '로그인 후 이용할 수 있어요.<br/>로그인 하시겠어요?',
        btnCancelName: '아니요',
        btnConfirmName: '네',
        isConfirm: true,
        dismiss: () => {
          this._modalService.dismiss();
        },
        confirm: () => {
          this.router.navigateByUrl('login');
          this.setRedirectUrl(redirectUrl);
          this._modalService.dismiss();
        }
      });
      return false;
    }

    return true;
  }

  reloadUserInfo(): void {
    const url = ApiUrl.user;
    this.apiService?.get({ url })?.subscribe(loginUser => {
      console.log('requestUser res => ', loginUser);
      this.login(loginUser);
    }, error => {
      console.log('requestUser error =>', error);
    });
  }
}
