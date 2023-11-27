import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../core/service/api/api.service';
import { ApiUrl } from '../../../core/constant/api.contant';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Validator } from '../../../core/validator/validator';
import { GlobalBlurHandler } from '../../../core/handler/globar-blur-handler/globar-blur-handler';
import { LayoutToastService } from '../../../layout/toast/layout-toast.service';

@Component({
  selector:    'app-customer-info-modal',
  templateUrl: './customer-info-modal.component.html',
  styleUrls:   [ './customer-info-modal.component.scss' ]
})
export class CustomerInfoModalComponent implements OnInit {
  @Input() customer: any;
  @Output() dismiss        = new EventEmitter();
  form: FormGroup;
  private SUpdateCustomerRequest: Subscription | undefined;
  isShowValidLine: boolean = false;
  mobilePhoneCarrier       = {
    1: 'KT',
    2: 'SKT',
    3: 'LGU+',
    4: 'KT 알뜰폰',
    5: 'SKT 알뜰폰',
    6: 'LGU+ 알뜰폰'
  };

  constructor(
    private _apiService: ApiService,
    private _formBuilder: FormBuilder,
    private _toastService: LayoutToastService
  ) {
  }

  ngOnInit(): void {
    console.log('customer', this.customer);
    this.form = this._getCustomerInfoForm();
    console.log('this.customerInfoForm', this.form);
  }

  onClose() {
    this.dismiss.emit();
  }

  onSelect(insurance: AbstractControl, value: any) {
    insurance.setValue(value);
    GlobalBlurHandler.blur();
  }


  onSubmit() {
    this.isShowValidLine = true;
    const value          = this.form.value;

    if (!this.form.valid) {
      this._toastService.alert('생년월일을 입력해 주세요.');
      return;
    }

    this._requestUpdateCustomer(value);

    this._toastService.alert('수정되었습니다.');
    this.dismiss.emit();
  }

  private _requestUpdateCustomer(value) {
    if (this.SUpdateCustomerRequest) { // 연속 처리 방지
      return;
    }


    const body = value;

    const url                   = ApiUrl.updateCustomer.replace(':id', this.customer.id.toString());
    this.SUpdateCustomerRequest = this._apiService.patch({
      url,
      body
    }).subscribe(res => {
      console.log('requestUpdateCustomer res => ', res);
      Object.keys(res).forEach(key => {
        this.customer[key] = res[key];
      });

      this.SUpdateCustomerRequest = null;
    }, error => {
      console.log('requestUpdateCustomer error =>', error);
      this.SUpdateCustomerRequest = null;
    });
  }

  private _getCustomerInfoForm() {
    return this._formBuilder.group({
      mobile_phone_number:  [
        this.customer.mobile_phone_number || '',
        [ Validator.mobile() ]
      ],
      birth_day:            [
        this.customer.birth_day || '',
        [
          Validators.required,
          Validator.date()
        ]
      ],
      mobile_phone_carrier: [
        this.customer.mobile_phone_carrier || 0,
        [ Validator.num() ]
      ],
      address:              [
        this.customer.address || ''
      ],
      job:                  [
        this.customer.job || ''
      ],
      drive_type:           [
        this.customer.drive_type || null
      ],
      memo:                 [
        this.customer.memo || ''
      ],
      email:                [
        this.customer.email || '',
        [ Validator.email() ]
      ],
      company:              [
        this.customer.company || ''
      ],
      business_type:        this.customer.business_type || '',
      drink_bottle:         [
        this.customer.drink_bottle || 0,
        [ Validator.num() ]
      ],
      drink_week:           [
        this.customer.drink_week || 0,
        [ Validator.num() ]
      ],
      smoke_daily:          [
        this.customer.smoke_daily || 0,
        [ Validator.num() ]
      ],
      smoke_years:          [
        this.customer.smoke_years || 0,
        [ Validator.num() ]
      ],
      height:               [
        this.customer.height || 0,
        [ Validator.num() ]
      ],
      weight:               [
        this.customer.weight || 0,
        [ Validator.num() ]
      ],
      baby_due_date:        [
        this.customer.baby_due_date || '',
        [ Validator.date() ]
      ]
    });
  }
}
