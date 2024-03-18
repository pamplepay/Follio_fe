import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IUser } from '../../../core/model/auth.model';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/service/auth/auth.service';
import { ApiService } from '../../../core/service/api/api.service';
import { FocusService } from '../../../core/module/focus/focus.service';
import { LayoutToastService } from '../../../layout/toast/layout-toast.service';
import { EditUserApiCondition } from '../edit-user/edit-user-modal.model';
import { ApiUrl } from '../../../core/constant/api.contant';
import { takeWhile } from 'rxjs/operators';
import { Validator } from '../../../core/validator/validator';

@Component({
  selector: 'app-recommend-code-modal',
  templateUrl: './recommend-code-modal.component.html',
  styleUrls: ['./recommend-code-modal.component.scss']
})
export class RecommendCodeModalComponent implements OnInit {

  @Output() complete = new EventEmitter();
  @Output() dismiss  = new EventEmitter();

  monthList: string[] | null = null;
  loginUser: IUser | null    = null;
  inputControl = new FormControl('', [Validators.required, Validators.maxLength(5)])

  isShowValidLine: boolean              = false;
  isUnsubscribe: boolean                = false;
  SEditUserRequest: Subscription | null = null;
  private SCheckRecommendCodeRequest: Subscription | undefined;
  private SCreateRecommendCodeRequest: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private _apiService: ApiService,
    private focusService: FocusService,
    private _toastService: LayoutToastService) {
  }

  ngOnInit(): void {
    this.loginUser = this.authService.getLoginUser();
    this.monthList = [];
  }

  ngOnDestroy(): void {
    this.isUnsubscribe = true;
  }

  /******************************     event functions     ****************************/


  onSave(): void {
    this.isShowValidLine = true;

    if (!this.inputControl?.valid) {
      this._toastService.alert('코드를 입력해 주세요');
      return;
    }

    const code = this.inputControl.value

    this._requestCreateRecommendCode(code);
  }

  onBlur($event: any, control: AbstractControl): void {
    control.setValue($event.target.value.trim());
  }

  onClose() {
    this.dismiss.emit();
  }

  private _requestCheckRecommendCode() {
    if (this.SCheckRecommendCodeRequest) { // 연속 처리 방지
      return;
    }

    const url = ApiUrl.findPassword;
    this.SCheckRecommendCodeRequest = this._apiService.get({
      url
    }).subscribe(res => {
        console.log('requestCheckRecommendCode res => ', res);
        this.SCheckRecommendCodeRequest = null;
      }, error => {
        console.log('requestCheckRecommendCode error =>', error);
        this.SCheckRecommendCodeRequest = null;
      });
  }

  private _requestCreateRecommendCode(recommend_code: any) {
    if (this.SCreateRecommendCodeRequest) { // 연속 처리 방지
      return;
    }

    const url = ApiUrl.recommendCode;
    const params = {
      recommend_code
    };

    this.SCreateRecommendCodeRequest = this._apiService.get({
      url, params
    }).subscribe(res => {
        console.log('requestCreateRecommendCode res => ', res);
        this.authService.reloadUserInfo();
        // const loginUser = this.authService.getLoginUser();
        // loginUser.recommend_user = res;
        //
        // this.authService.login(loginUser);
        this.complete.emit();
        this.SCreateRecommendCodeRequest = null;
      }, error => {
        console.log('requestCreateRecommendCode error =>', error);
        if (error?.error?.length > 0) {
          this._toastService.alert(error.error);
        }
      this.SCreateRecommendCodeRequest = null;
      });
  }

}
