import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/service/api/api.service';
import { Subscription } from 'rxjs';
import { LayoutModalService } from '../../layout/modal/layout-modal.service';
import { AlertModalComponent } from '../../shared/modals/alert/alert-modal.component';
import { ApiUrl } from '../../core/constant/api.contant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Validator } from '../../core/validator/validator';
import { AuthService } from '../../core/service/auth/auth.service';
import { IUser } from '../../core/model/auth.model';
import { Router } from '@angular/router';
import { LayoutHeaderService } from '../../layout/header/layout-header.service';
import { LayoutFooterService } from '../../layout/footer/layout-footer.service';
import { LayoutToastService } from '../../layout/toast/layout-toast.service';
import { TermModalComponent } from '../../shared/modals/term/term-modal.component';

@Component({
  selector:    'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls:   [ './customer-create.component.scss' ]
})
export class CustomerCreateComponent implements OnInit {

  form: FormGroup;
  isFourTeen: boolean;
  isShowValidLine: boolean = false;
  isDone: boolean          = false;

  private SCreateCustomerRequest: Subscription | undefined;
  private loginUser: IUser;

  constructor(
    private _apiService: ApiService,
    private _modalService: LayoutModalService,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private _headerService: LayoutHeaderService,
    private _footerService: LayoutFooterService,
    private _toastService: LayoutToastService,
  ) {
  }

  ngOnInit(): void {
    this._headerService.show();
    this._footerService.show();

    this.loginUser = this._authService.getLoginUser();
    this._modalService.create(AlertModalComponent, {
      width:          '338px',
      title:          '고객 추가',
      body:           '추가 고객이 만 14세 이상인가요?',
      btnCancelName:  '아니요',
      btnConfirmName: '네',
      isConfirm:      true,
      dismiss:         () => {
        this._modalService.dismiss();
        history.back();
      },
      cancel:         () => {
        this.isFourTeen = false;
        this.form       = this._formBuilder.group({
          'name':                      [
            '',
            [
              Validators.required,
              Validator.kor()
            ]
          ],
          'mobile_phone_number':       [
            '',
            [
              Validators.required,
              Validator.mobile()
            ]
          ],
          'birth_day':                 [
            '',
            [
              Validators.required,
              Validator.date()
            ]
          ],
          'relation_name':             [
            '',
            [
              Validators.required,
              Validator.kor()
            ]
          ],
          'legal_representative_name': [
            '',
            [
              Validators.required,
              Validator.kor()
            ]
          ]
        });

        this._modalService.dismiss();
      },
      confirm:        () => {
        this.isFourTeen = true;

        this.form = this._formBuilder.group({
          'name':                [
            '',
            [
              Validators.required,
              Validator.kor()
            ]
          ],
          'mobile_phone_number': [
            '',
            [
              Validators.required,
              Validator.mobile()
            ]
          ]
        });
        this._modalService.dismiss();
      }
    });
  }

  onGotoCustomerList() {
    this._router.navigateByUrl('/customer');
  }

  onNext(): void {
    this.isShowValidLine = true;
    this._changeDetectorRef.detectChanges();
    if (!this.form.valid) {
      const error = document.querySelector('.form-input-wrap.error');
      error.scrollIntoView({
        block:    'center',
        behavior: 'smooth'
      });
      return;
    }

    this._modalService.create(AlertModalComponent, {
      width:          '418px',
      title:          '개인정보 이용을 위해 고객님의 동의가 필요해요.',
      body:           '입력하신 정보로 고객님에게 동의 링크를 전송할까요?<br/>' +
                        '링크 내용은 <a class="show-link"">여기</a>에서 확인하실 수 있어요.',
      btnCancelName:  '아니요',
      btnConfirmName: '네',
      isConfirm:      true,
      isLink: true,
      dismiss:        () => {
        this._modalService.dismiss();
      },
      cancel:         () => {
        this._modalService.dismiss();
      },
      confirm:        () => {
        const value = this.form.value;
        this._requestCreateCustomer(value);
        this._modalService.dismiss();
      },
      link: () => {
        this._showTermModal();
      }
    });
  }

  /******************************     request functions     ****************************/


  private _requestCreateCustomer(value) {
    if (this.SCreateCustomerRequest) { // 연속 처리 방지
      return;
    }

    const url                   = ApiUrl.createCustomer;
    const body                  = {
      user: this.loginUser.id,
      ...value
    };
    this.SCreateCustomerRequest = this._apiService.post({
      url,
      body
    }).subscribe(res => {
      console.log('requestCreateCustomer res => ', res);
      this.isDone                 = true;
      this.SCreateCustomerRequest = null;
    }, error => {
      console.log('requestCreateCustomer error =>', error);
      if (error.error.length > 0) {
        this._toastService.alert(error.error);
      }
      this.SCreateCustomerRequest = null;
    });
  }

  private _showTermModal(): void {
    this._modalService.create(TermModalComponent, {
      dismiss: () => {
        this._modalService.dismiss();
      }
    });
  }
}
