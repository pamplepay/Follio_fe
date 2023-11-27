import { Component, OnDestroy, OnInit } from '@angular/core';
import { KakaoService } from '../../core/service/kakao/kakao.service';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { LayoutToastService } from '../../layout/toast/layout-toast.service';
import { ApiUrl } from '../../core/constant/api.contant';
import { ApiService } from '../../core/service/api/api.service';
import { AuthService } from '../../core/service/auth/auth.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Validator } from '../../core/validator/validator';
import { IUser } from '../../core/model/auth.model';
import { EditUserApiCondition } from '../../shared/modals/edit-user/edit-user-modal.model';
import { takeWhile } from 'rxjs/operators';
import { LayoutHeaderService } from '../../layout/header/layout-header.service';
import { LayoutFooterService } from '../../layout/footer/layout-footer.service';

@AutoUnsubscribe()
@Component({
  selector:    'app-login',
  templateUrl: './login.component.html',
  styleUrls:   [ './login.component.scss' ]
})
export class LoginComponent implements OnInit, OnDestroy {
  private SKakaoLoginRequest: Subscription;
  userInfoForm: FormGroup;
  isFirstVisit: boolean    = false;
  isLogin: boolean         = false;
  loginUser: IUser | null  = null;
  isShowValidLine: boolean = false;
  private SEditUserRequest: Subscription;

  constructor(
    private _kakaoService: KakaoService,
    private _apiService: ApiService,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _toastService: LayoutToastService,
    private _headerService: LayoutHeaderService,
    private _footerService: LayoutFooterService
  ) {
  }

  ngOnInit(): void {
    this._headerService.show();
    this._footerService.show();

  }

  ngOnDestroy(): void {
  }

  /******************************     event functions     ****************************/

  async onKakaoLogin() {
    const kakaoResult = await this._kakaoService.login();
    if (kakaoResult?.isError) {
      return;
    }

    console.log('kakaoResult', kakaoResult);
    this._requestKakaoLogin(kakaoResult);
  }

  onUpdateUserInfo(): void {
    this.isShowValidLine = true;

    console.log(this.userInfoForm);
    if (!this.userInfoForm?.valid) {
      this._toastService.alert('내용을 확인해 주세요');
      return;
    }

    const { name, email, phone_number, company }: EditUserApiCondition = this.userInfoForm.value;
    const phoneNumberSplit = phone_number.split('-').join('');
    this.requestEditUser({
      name,
      email,
      phone_number: phoneNumberSplit,
      company
    });
  }

  onBlur($event: any, control: AbstractControl): void {
    control.setValue($event.target.value.trim());
  }

  /******************************     request functions     ****************************/

  private _requestKakaoLogin({ nickname, email, thumbnail_image = '' }) {
    if (this.SKakaoLoginRequest) { // 연속 처리 방지
      this._toastService.alert('잠시만 기다려주세요.');
      return;
    }

    const url               = ApiUrl.kakaoLogin;
    const body              = {
      nickname,
      email,
      thumbnail_image
    };
    this.SKakaoLoginRequest = this._apiService.post({
      url,
      body
    }).subscribe(res => {
      console.log('requestKakaoLogin res => ', res);
      const loginUser = res;
      console.log('requestLogin res => ', loginUser);
      this.loginUser = loginUser;
      this._authService.login(loginUser);
      // 되돌아갈 페이지가 있다면 해당 페이지로 이동
      this.isLogin = true;
      if (!this.loginUser.is_first_visit) {
        const redirectUrl = this._authService.getRedirectUrl();

        if (redirectUrl) {
          this._authService.setRedirectUrl(null);
          this._router.navigateByUrl(redirectUrl);
        } else {
          this._router.navigateByUrl('main');
        }
      } else {
        this.isFirstVisit = true;
        this.userInfoForm = this.getUserInfoForm();
      }

      this.SKakaoLoginRequest = null;
    }, error => {
      console.log('requestKakaoLogin error =>', error);
      const message = error?.error?.details?.[0].message;
      if (message) {
        this._toastService.alert('로그인을 할 수 없습니다.');
      }
      this.SKakaoLoginRequest = null;
    });
  }


  /******************************     request functions     ****************************/

  private requestEditUser({ name, email, phone_number, company }: EditUserApiCondition) {
    if (this.SEditUserRequest) { // 연속 처리 방지
      alert('잠시만 기다려주세요.');
      return;
    }

    const url  = ApiUrl.user;
    const body = {
      name,
      email,
      phone_number,
      company
    };

    this.SEditUserRequest = this._apiService.patch({
      url,
      body
    })?.subscribe(user => {
      this.SEditUserRequest = null;
      console.log('requestEditUser res => ', user);
      this._authService.updateLoginUser(user);

      const redirectUrl = this._authService.getRedirectUrl();

      if (redirectUrl) {
        this._authService.setRedirectUrl(null);
        this._router.navigateByUrl(redirectUrl);
      } else {
        this._router.navigateByUrl('main');
      }
    }, error => {
      this.SEditUserRequest = null;
      console.log('requestEditUser error =>', error);
    });
  }


  private getUserInfoForm(): FormGroup {
    const result = this._formBuilder.group({
      name: [
        this.loginUser?.name || '',
        [
          Validators.required,
        ]
      ],
      email:        [
        this.loginUser?.email || '',
        [
          Validators.required,
          Validator.email()
        ]
      ],
      company:      [
        this.loginUser?.company || '',
        [
          Validators.required
        ]
      ],
      phone_number: [
        this.loginUser?.phone_number || '',
        [
          Validators.required,
          Validator.mobile()
        ]
      ]
    });

    return result;
  }
}
