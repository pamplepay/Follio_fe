import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangePasswordApiCondition } from '../edit-user/edit-user-modal.model';
import { takeWhile } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ApiUrl } from '../../../core/constant/api.contant';
import { ApiService } from '../../../core/service/api/api.service';
import { Validator } from '../../../core/validator/validator';

@Component({
  selector:    'app-edit-password',
  templateUrl: './edit-password-modal.component.html',
  styleUrls:   [ './edit-password-modal.component.scss' ]
})
export class EditPasswordModalComponent implements OnInit, OnDestroy {

  @Output() save = new EventEmitter();
  @Output() dismiss = new EventEmitter();

  passwordEditForm: FormGroup | null = null;
  isShowValidLine: boolean = false;
  isUnsubscribe: boolean = false;
  SEditPasswordRequest: Subscription | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    this.passwordEditForm = this.getPasswordEditForm();
  }

  ngOnDestroy(): void {
    this.isUnsubscribe = true;
  }

  /******************************     event functions     ****************************/


  onSave() {
    this.isShowValidLine = true;
    console.log(this.passwordEditForm);
    if(!this?.validateForm()) {
      return;
    }

    const { old_password, new_password2, new_password1 }: ChangePasswordApiCondition = this.passwordEditForm?.value;
    this.requestChangePassword({
      old_password,
      new_password2,
      new_password1
    });
  }

  onClose() {
    this.dismiss.emit();
  }

  /******************************     request functions     ****************************/

  private requestChangePassword({ old_password, new_password1, new_password2 }: ChangePasswordApiCondition) {
    if (this.SEditPasswordRequest) { // 연속 처리 방지
      alert('잠시만 기다려주세요.');
      return;
    }

    const url                            = ApiUrl.changePassword;
    const body                           = {
      old_password,
      new_password1,
      new_password2
    };
    this.SEditPasswordRequest = this.apiService.post({
      url,
      body
    })?.pipe(takeWhile(() => this.isUnsubscribe === false))
      .subscribe(res => {
        this.SEditPasswordRequest = null;
        console.log('requestEditPassword res => ', res);
        if (res?.detail) {
          alert(res.detail);
        }
        this.save.emit();
      }, error => {
        this.SEditPasswordRequest = null;
        console.log('requestEditPassword error =>', error);
      });
  }

  /******************************     etc functions     ****************************/


  private getPasswordEditForm(): FormGroup {
    let result = null;

    result       = this.formBuilder.group({
      old_password:  [
        '',
        [
          Validators.required
        ]
      ],
      new_password1: [
        '',
        [
          Validators.required,
          Validator.password(),
          Validators.minLength(6),
        ]
      ],
      new_password2: ''
    });

    result.get('new_password2')?.setValidators([
      Validators.required,
      Validator.passwordConfirm(result.get('new_password1'))
    ]);

    return result;
  }

  private validateForm(): boolean {
    if(!this.passwordEditForm?.get('old_password')?.valid) {
      alert('이전 비밀번호를 확인해 주세요.');
      return false;
    }

    if (this.passwordEditForm?.get('new_password1')?.errors?.['minlength']) {
      alert('비밀번호는 영어 대/소문자, 숫자, 특수문자를 혼합하여 6자리 이상으로 입력주세요.');
      return false;
    }

    if (this.passwordEditForm?.get('new_password1')?.errors?.['notEqualPassword']) {
      alert('비밀번호는 영어 대/소문자, 숫자, 특수문자를 혼합하여 6자리 이상으로 입력주세요.');
      return false;
    }

    if (this.passwordEditForm?.get('new_password1')?.errors?.['koreanInPassword']) {
      alert(this.passwordEditForm?.get('new_password1')?.errors?.['koreanInPassword'].message);
      return false;
    }

    if (this.passwordEditForm?.get('new_password1')?.errors?.['spaceInPassword']) {
      alert(this.passwordEditForm?.get('new_password1')?.errors?.['spaceInPassword'].message);
      return false;
    }

    if (this.passwordEditForm?.get('new_password2')?.errors?.['notSamePassword']) {
      alert(this.passwordEditForm?.get('new_password2')?.errors?.['notSamePassword'].message);
      return false;
    }

    return true;
  }
}
