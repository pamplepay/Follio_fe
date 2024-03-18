import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EditUserApiCondition } from './edit-user-modal.model';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { FocusService } from '../../../core/module/focus/focus.service';
import { ApiUrl } from '../../../core/constant/api.contant';
import { ApiService } from '../../../core/service/api/api.service';
import { AuthService } from '../../../core/service/auth/auth.service';
import { IUser } from '../../../core/model/auth.model';
import { Validator } from '../../../core/validator/validator';
import { LayoutToastService } from '../../../layout/toast/layout-toast.service';

@Component({
  selector:    'app-user-detail-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls:   [ './edit-user-modal.component.scss' ]
})
export class EditUserModalComponent implements OnInit, OnDestroy {

  @Output() complete = new EventEmitter();
  @Output() dismiss  = new EventEmitter();

  monthList: string[] | null = null;
  loginUser: IUser | null    = null;
  editForm: FormGroup | null = null;
  yearList: number[] | null  = null;

  isShowValidLine: boolean              = false;
  isUnsubscribe: boolean                = false;
  SEditUserRequest: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private focusService: FocusService,
    private _toastService: LayoutToastService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.loginUser = this.authService.getLoginUser();
    this.monthList = [];
    this.editForm  = this.getEditForm();
  }

  ngOnDestroy(): void {
    this.isUnsubscribe = true;
  }

  /******************************     event functions     ****************************/


  onSave(): void {
    this.isShowValidLine = true;

    console.log(this.editForm);
    if (!this.editForm?.valid) {
      this._toastService.alert('내용을 확인해 주세요');
      return;
    }

    const { email, phone_number, company }: EditUserApiCondition = this.editForm.value;
    const phoneNumberSplit = phone_number.split('-').join('');
    this.requestEditUser({
      email, phone_number: phoneNumberSplit, company
    });
  }

  onBlur($event: any, control: AbstractControl): void {
    control.setValue($event.target.value.trim());
  }

  onClose() {
    this.dismiss.emit();
  }

  /******************************     request functions     ****************************/

  private requestEditUser({ email, phone_number, company }: EditUserApiCondition) {
    if (this.SEditUserRequest) { // 연속 처리 방지
      this._toastService.alert('잠시만 기다려주세요.');
      return;
    }

    const url  = ApiUrl.user;
    const body = {
      email, phone_number, company
    };

    this.SEditUserRequest = this.apiService.patch({
      url,
      body
    })?.pipe(takeWhile(() => this.isUnsubscribe === false))
      .subscribe(user => {
        this.SEditUserRequest = null;
        console.log('requestEditUser res => ', user);

        this._toastService.alert('수정 되었습니다.');
        this.authService.updateLoginUser(user);

        this.complete.emit();
      }, error => {
        this.SEditUserRequest = null;
        console.log('requestEditUser error =>', error);
      });
  }

  /******************************     etc functions     ****************************/

  private getEditForm(): FormGroup {
    const result = this.formBuilder.group({
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
