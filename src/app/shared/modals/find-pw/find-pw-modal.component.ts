import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Validator } from '../../../core/validator/validator';
import { ApiUrl } from '../../../core/constant/api.contant';
import { takeWhile } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../core/service/api/api.service';
import { FindPasswordApiCondition } from './find-pw-modal.model';
import { LayoutToastService } from '../../../layout/toast/layout-toast.service';

@Component({
  selector:    'app-find-pw-modal',
  templateUrl: './find-pw-modal.component.html',
  styleUrls:   [ './find-pw-modal.component.scss' ]
})
export class FindPwModalComponent implements OnInit, OnDestroy {

  @Output() dismiss = new EventEmitter();

  emailControl: FormControl | null = null;

  isUnsubscribe: boolean = false;
  isShowValidLine: boolean = false;

  SFindPasswordRequest: Subscription | null = null;

  constructor(
    private apiService: ApiService,
    private changeDetectRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.emailControl = new FormControl('',
      {
        validators: [
          Validators.required,
          Validator.email()
        ],
        updateOn:   'change'
      }
    );
  }

  ngOnDestroy(): void {
    this.isUnsubscribe = true;
  }

  onClose() {
    this.dismiss.emit();
  }

  onSend(): void {
    this.emailControl?.setValue(this.emailControl.value.trim());
    this.changeDetectRef.detectChanges();
    this.emailControl?.updateValueAndValidity();
    this.isShowValidLine = true;

    if (!this.emailControl?.valid) {
      alert('이메일을 작성해 주세요.');
      return;
    }

    const email = this.emailControl?.value;

    this.requestFindPassword({ email });
  }


  private requestFindPassword({ email }: FindPasswordApiCondition) {
    if (this.SFindPasswordRequest) {
      alert('잠시만 기다려주세요.');
      return;
    }

    const url                            = ApiUrl.findPassword;
    const body                           = { email };
    this.SFindPasswordRequest = this.apiService.post({
      url,
      body
    })?.pipe(takeWhile(() => this.isUnsubscribe === false))
      .subscribe(res => {
        console.log('requestFindPassword res => ', res);
        alert('비밀번호 재설정 이메일이 발송되었습니다.');
        this.dismiss.emit();
      }, error => {
        this.SFindPasswordRequest = null;
        console.log('requestFindPassword error =>', error);
        alert('처리중에 에러가 발생하였습니다.');
        this.dismiss.emit();
      });
  }
}
