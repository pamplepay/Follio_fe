import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalBlurHandler } from '../../core/handler/globar-blur-handler/globar-blur-handler';
import { CommonService } from '../../core/service/common/common.service';
import { AuthService } from '../../core/service/auth/auth.service';
import { ApiService } from '../../core/service/api/api.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ICommonInsurance, IDetail } from '../../core/model/common.model';
import { IUser } from '../../core/model/auth.model';
import { combineLatest, Subscription } from 'rxjs';
import { ApiUrl } from '../../core/constant/api.contant';
import { AlertModalComponent } from '../../shared/modals/alert/alert-modal.component';
import { LayoutModalService } from '../../layout/modal/layout-modal.service';
import { LayoutToastService } from '../../layout/toast/layout-toast.service';
import { LayoutHeaderService } from '../../layout/header/layout-header.service';
import { Validator } from '../../core/validator/validator';
import { DateHandler } from '../../core/handler/date-handler/date-handler';
import { debounceTime, filter, startWith, takeWhile } from 'rxjs/operators';
import { LayoutFooterService } from '../../layout/footer/layout-footer.service';
import { CustomerService } from '../../core/service/customer/customer.service';

@AutoUnsubscribe()
@Component({
  selector:    'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls:   [ './template-form.component.scss' ]
})
export class TemplateFormComponent implements OnInit, OnDestroy {
  commonInsurance: ICommonInsurance | undefined;
  form: FormGroup | undefined;
  caseForm: any | undefined = {};
  insuranceNameList         = {};
  customerInsurance: any | undefined;
  tagControl                = new FormControl('');
  isShowValidLine: boolean  = false;
  thousandsMask: any        = {
    mask:               Number,
    thousandsSeparator: ','
  };
  customer: any;

  loginUser: IUser;
  isUnsubscribe: boolean = false;
  isTemplate: boolean = false;
  private SCreateInsuranceTemplateRequest: Subscription | undefined;
  private SUpdateInsuranceTemplateRequest: Subscription | undefined;
  private SDeleteInsuranceTemplateRequest: Subscription | undefined;

  constructor(
    private _authService: AuthService,
    private _apiService: ApiService,
    private _commonService: CommonService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _modalService: LayoutModalService,
    private _toastService: LayoutToastService,
    private _customerService: CustomerService,
    private _headerService: LayoutHeaderService,
    private _changeDetectRef: ChangeDetectorRef,
    private _footerService: LayoutFooterService
  ) {
  }

  ngOnInit() {
    this._headerService.show();
    this._footerService.show();
    this.loginUser         = this._authService.getLoginUser();
    this.customerInsurance = this._route.snapshot.data?.insuranceTemplate;
    this.isTemplate = this._route.snapshot.queryParams?.isTemplate || (!this.customerInsurance?.customer && this.customerInsurance?.is_template) || false;


    this._customerService.rxSelectedCustomer().pipe(takeWhile(() => this.isUnsubscribe === false)).subscribe(customer => {
      console.log('customer', customer);
      this.customer = customer;
    });

    console.log('this.insuranceTemplate', this.customerInsurance);
    this._commonService.rxInsurance().subscribe(insurance => {
      this.commonInsurance = insurance;
      this.commonInsurance.insurance_list.forEach(insuranceItem => {
        this.insuranceNameList[insuranceItem.id] = insuranceItem.name;
      });
      if (!this.form) {
        this.form = this._getInsuranceTemplateForm(this.customerInsurance);
        this._subscribeFormChanges();
        console.log('this.form.value', this.form.value, this.form.value.insurance_type);
        this._initRequired(this.form.value.insurance_type);
      } else {
        this._subscribeFormChanges();
      }
    });

    this._commonService.rxInsurance().toPromise().then(value => {
      this.commonInsurance = value;
    });

    if (this.customerInsurance) {
      console.log('this.customerInsurance', this.customerInsurance);
      this.customer = {
        id:   this.customerInsurance?.customer,
        name: this.customerInsurance?.customer_name
      };
    }
  }

  ngOnDestroy(): void {
    this.isUnsubscribe = true;
  }

  /******************************     event functions     ****************************/
  onBack() {
    history.back();
  }

  onSubmit() {
    console.log('this.form.valid', this.form, this.form.valid);
    this.isShowValidLine = true;

    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach(key => {
        console.log(key, this.form.controls[key].valid);
      });

      this._changeDetectRef.detectChanges();

      document.getElementsByClassName('error')[0].scrollIntoView({
        behavior: 'smooth',
        block:    'center'
      });
      return;
    }

    const formValue         = this.form.value;
    const caseFormList: any = Object.values(this.caseForm).reduce((a: any[], b: any[]) => a.concat(b), []);
    const caseList          = caseFormList.map(form => form.value);

    // 갱신 비갱신 납입 개월 계산
    if (formValue.warranty_period_type === 1) {
      formValue.expected_due_year = formValue.warranty_period - formValue.old;
    }
    if (formValue.warranty_period_type === 2) {
      formValue.expected_due_year = formValue.warranty_period;
    }
    if (formValue.warranty_period_type === 3) {
      formValue.expected_due_year = 100;
    }

    if (this.customer?.id) {
      formValue.customer       = this.customer.id;
      formValue.portfolio_type = 2;
    }

    if (!formValue.renewal_growth_rate) {
      formValue.renewal_growth_rate = 3;
    }

    if (!this.customerInsurance) {
      this._requestCreateInsuranceTemplate(formValue, caseList);
    } else {
      this._requestUpdateInsuranceTemplate(formValue, caseList);
    }
  }


  onSelect(value, control: AbstractControl) {
    control.setValue(value);
    GlobalBlurHandler.blur();
  }

  onSelectWarrantyPeriodType(value: number, warrantyPeriodType: AbstractControl, warrantyPeriod: AbstractControl) {
    warrantyPeriodType.setValue(value);
    warrantyPeriod.setValue('');
    GlobalBlurHandler.blur();
  }

  onClickInsuranceType(type) {
    this.form.get('insurance_type').setValue(type);

    this._initRequired(type);
  }

  onAddCase(caseDetailItem: IDetail) {
    const caseForm = this._getCaseForm(caseDetailItem);
    this.caseForm[caseDetailItem.id].push(caseForm);
  }

  onDeleteCase(caseDetailItem, caseFormIndex) {
    this.caseForm[caseDetailItem.id].splice(caseFormIndex, 1);
  }

  onDeleteInsurance() {
    this._modalService.create(AlertModalComponent, {
      title:     '삭제하기',
      body:      '정말 삭제 하시겠어요?',
      isConfirm: true,
      dismiss:   () => this._modalService.dismiss(),
      cancel:    () => this._modalService.dismiss(),
      confirm:   () => {
        this._requestDeleteInsuranceTemplate();
        this._modalService.dismiss();
      }
    });
  }

  onAddTag($event) {
    $event.stopPropagation();
    GlobalBlurHandler.blur();
    this._changeDetectRef.detectChanges();
    let tag = this.tagControl.value;
    tag     = tag.trim();
    this.tagControl.setValue('');

    const tagList = this.form.get('tags').value;
    if (tagList.indexOf(tag) !== -1) {
      return;
    }
    tagList.push(tag);
    this.form.get('tags').setValue(tagList);
  }

  onDeleteTag(tagIndex) {
    const tagList = this.form.get('tags').value;
    tagList.splice(tagIndex, 1);
    this.form.get('tags').setValue(tagList);
  }

  onClickIsCommon($event) {
    $event.stopPropagation();
    const isCommon = this.form.get('is_common').value;
    this.form.get('is_common').setValue(!isCommon);
    this.form.get('is_common').updateValueAndValidity();
  }

  onGotoAnalysis() {
    let url = 'template/' + this.customerInsurance.id + '/analysis';
    console.log('this.customer', this.customer);
    if (this.customer) {
      url = 'insurance/' + this.customerInsurance.id + '/analysis';
    }

    console.log('url', url);

    this._router.navigateByUrl(url);
  }

  onFocusMonthlyEarnedPremium($event) {
    console.log('onFocusMonthlyEarnedPremium', $event);
    if ($event.target.value == '0') {
      this.form.get('monthly_earned_premium').setValue('');
    }
  }

  /******************************     request functions     ****************************/

  private _requestCreateInsuranceTemplate(value, caseList) {
    if (this.SCreateInsuranceTemplateRequest) { // 연속 처리 방지
      return;
    }

    const url         = ApiUrl.createCustomerInsurance;
    const body        = value;
    body['case_list'] = caseList;

    this.SCreateInsuranceTemplateRequest = this._apiService.post({
      url,
      body
    }).subscribe(res => {
      console.log('requestCreateInsuranceTemplate res => ', res);
      this.customerInsurance = res;
      this.form              = this._getInsuranceTemplateForm(this.customerInsurance);
      this._subscribeFormChanges();
      this._toastService.alert('저장 되었습니다.');
      this.SCreateInsuranceTemplateRequest = null;
    }, error => {
      console.log('requestCreateInsuranceTemplate error =>', error);
      this.SCreateInsuranceTemplateRequest = null;
    });
  }

  private _requestUpdateInsuranceTemplate(value, caseList) {
    if (this.SUpdateInsuranceTemplateRequest) { // 연속 처리 방지
      return;
    }

    const url = ApiUrl.updateCustomerInsurance.replace(':id', this.customerInsurance.id.toString());

    const body        = value;
    body['case_list'] = caseList;

    this.SUpdateInsuranceTemplateRequest = this._apiService.patch({
      url,
      body
    }).subscribe(res => {
      console.log('requestUpdateInsuranceTemplate res => ', res);
      this.customerInsurance = res;
      this.form              = this._getInsuranceTemplateForm(this.customerInsurance);
      this._subscribeFormChanges();
      this._toastService.alert('저장 되었습니다.');
      this.SUpdateInsuranceTemplateRequest = null;
    }, error => {
      console.log('requestUpdateInsuranceTemplate error =>', error);
      this.SUpdateInsuranceTemplateRequest = null;
    });
  }


  /******************************     etc functions     ****************************/

  private _getInsuranceTemplateForm(insuranceTemplate: any) {
    const result = this._formBuilder.group({
      id:                        insuranceTemplate?.id || null,
      insurance:                 [
        insuranceTemplate?.insurance || null,
        Validators.required
      ],
      insurance_type:            insuranceTemplate?.insurance_type || 1,
      is_common:                 insuranceTemplate?.is_common || false,
      user:                      this.loginUser?.id,
      name:                      [
        insuranceTemplate?.name || '',
        [
          Validators.required
        ]
      ],
      tags:                      insuranceTemplate?.tags ? [ insuranceTemplate?.tags ] : [ [] ],
      payment_period:            [
        insuranceTemplate?.payment_period || '',
        [
          Validators.required,
          Validator.num()
        ]
      ],
      refund_type:               insuranceTemplate?.refund_type || 1,
      payment_period_type:       insuranceTemplate?.payment_period_type || 1,
      warranty_period:           [
        insuranceTemplate?.warranty_period || null,
        insuranceTemplate?.warranty_period_type === 3 ? [] :
        [
          Validators.required,
          Validator.num()
        ]
      ],
      warranty_period_type:      insuranceTemplate?.warranty_period_type || 1,
      monthly_earned_premium:    insuranceTemplate?.monthly_earned_premium || null,
      monthly_special_premium:   insuranceTemplate?.monthly_special_premium || null,
      old:                       [
        insuranceTemplate?.old || '',
        [
          Validators.required,
          Validator.num()
        ]
      ],
      expiry_date:               insuranceTemplate?.expiry_date || null,
      monthly_assurance_premium: [
        insuranceTemplate?.monthly_assurance_premium || null,
        [ Validator.num() ]
      ],
      monthly_renewal_premium:   [
        insuranceTemplate?.monthly_renewal_premium || null,
        [ Validator.num() ]
      ],
      monthly_premiums:          [
        insuranceTemplate?.monthly_premiums || null,
        [ Validator.num() ]
      ],
      monthly_contract_premium:  insuranceTemplate?.monthly_contract_premium || null,
      renewal_growth_rate:       [
        insuranceTemplate?.renewal_growth_rate || 3,
        [ Validator.num() ]
      ],
      expected_due_year:         '',
      portfolio_type:            0,
      is_template:               true
    });

    this.commonInsurance.categories.forEach(categoryItem => {
      categoryItem.sub_category_list.forEach(subCategory => {
        subCategory.detail_list.forEach(detail => {
          this.caseForm[detail.id] = [];

          const insuranceCaseList = this.customerInsurance?.case_list.filter(insuranceCase => insuranceCase.detail === detail.id);
          if (insuranceCaseList?.length > 0) {
            insuranceCaseList.forEach(item => {
              const caseForm = this._getCaseForm(detail, item);
              this.caseForm[detail.id].push(caseForm);
            });
          } else {
            const caseForm = this._getCaseForm(detail);
            this.caseForm[detail.id].push(caseForm);
          }
        });
      });
    });

    return result;
  }

  private _requestDeleteInsuranceTemplate() {
    if (this.SDeleteInsuranceTemplateRequest) { // 연속 처리 방지
      return;
    }

    const url                            = ApiUrl.deleteCustomerInsurance.replace(':id', this.customerInsurance.id);
    this.SDeleteInsuranceTemplateRequest = this._apiService.delete({
      url
    }).subscribe(res => {
      console.log('requestDeleteInsuranceTemplate res => ', res);
      this._toastService.alert('삭제 되었습니다.');
      if (this.customerInsurance.customer) {
        this._router.navigateByUrl('customer/' + this.customerInsurance.customer);
      } else {
        this._router.navigateByUrl('template');
      }
      this.SDeleteInsuranceTemplateRequest = null;
    }, error => {
      console.log('requestDeleteInsuranceTemplate error =>', error);
      this.SDeleteInsuranceTemplateRequest = null;
    });
  }


  private _getCaseForm(detail, insuranceDetail?: any) {
    return this._formBuilder.group(
      {
        id:                   insuranceDetail?.id || null,
        insurance:            insuranceDetail?.insurance || null,
        detail:               insuranceDetail?.detail || detail.id,
        assurance_amount:     insuranceDetail?.assurance_amount || '',
        premium:              insuranceDetail?.premium || '',
        payment_period_type:  insuranceDetail?.payment_period_type || 1,
        payment_period:       insuranceDetail?.payment_period || '',
        warranty_period_type: insuranceDetail?.warranty_period_type || 1,
        warranty_period:      insuranceDetail?.warranty_period || null
      });
  }

  private _initRequired(type: any) {
    if (type === 1) {
      this.form.get('monthly_assurance_premium').setValidators([ Validator.num() ]);
      this.form.get('monthly_assurance_premium').updateValueAndValidity();

      this.form.get('monthly_earned_premium').setValidators([ Validator.num() ]);
      this.form.get('monthly_earned_premium').updateValueAndValidity();

      this.form.get('monthly_contract_premium').setValidators([
        Validators.required,
        Validator.num()
      ]);
      this.form.get('monthly_contract_premium').updateValueAndValidity();
      this.form.get('monthly_premiums').setValidators([
        Validators.required,
        Validator.num()
      ]);
      this.form.get('monthly_premiums').updateValueAndValidity();
    }

    if (type === 2) {
      this.form.get('monthly_contract_premium').setValidators([ Validator.num() ]);
      this.form.get('monthly_contract_premium').updateValueAndValidity();

      if (this.form.get('warranty_period_type').value === 3) {
        this.form.get('warranty_period_type').setValue(1);
        this.form.get('warranty_period').setValidators([
          Validators.required,
          Validator.num()
        ]);
        this.form.get('warranty_period').updateValueAndValidity();
      }

      this.form.get('monthly_assurance_premium').setValidators([
        Validators.required,
        Validator.num()
      ]);
      this.form.get('monthly_assurance_premium').updateValueAndValidity();

      this.form.get('monthly_earned_premium').setValidators([
        Validator.num()
      ]);
      this.form.get('monthly_earned_premium').updateValueAndValidity();

      this.form.get('monthly_premiums').setValidators([
        Validator.num()
      ]);
      this.form.get('monthly_premiums').updateValueAndValidity();
    }
  }


  private _subscribeFormChanges() {
    combineLatest([
      this.form.get('insurance_type').valueChanges.pipe(startWith(null)),
      this.form.get('monthly_premiums').valueChanges.pipe(startWith(null), filter((_) => {
        if (_ === null) {
          return true;
        }
        return this.form.get('insurance_type').value === 1;
      })),
      this.form.get('monthly_earned_premium').valueChanges.pipe(startWith(null), filter((_) => {
        if (_ === null) {
          return true;
        }
        return this.form.get('insurance_type').value === 2;
      })),
      this.form.get('monthly_contract_premium').valueChanges.pipe(startWith(null)),
      this.form.get('monthly_assurance_premium').valueChanges.pipe(startWith(null)),
      this.form.get('monthly_renewal_premium').valueChanges.pipe(startWith(null)),
      this.form.get('payment_period_type').valueChanges.pipe(startWith(null)),
      this.form.get('refund_type').valueChanges.pipe(startWith(null))
    ]).pipe(debounceTime(10)).subscribe(value => {
      this.form.updateValueAndValidity();
      if (this.form.value.insurance_type === 1) {
        this._calculateLife();
      } else {
        this._calculateWound();
      }
    });


    this.form.get('insurance_type').valueChanges.subscribe(value => {
      this._initRequired(value);
    });

    this.form.get('warranty_period_type').valueChanges.subscribe(value => {
      console.log('warranty_period_type', value);

      if (value === 3) {
        this.form.get('warranty_period').setValue(null);
        this.form.get('warranty_period').clearValidators();
        this.form.get('warranty_period').updateValueAndValidity();
      } else {
        this.form.get('warranty_period').setValidators([
          Validators.required,
          Validator.num()
        ]);
        this.form.get('warranty_period').updateValueAndValidity();
      }

    });

    if (this.form.value.insurance_type === 1) {
      this._calculateLife();
    } else {
      this._calculateWound();
    }
  }

  private _calculateLife(): void {
    const formValue      = this.form.value;
    const calculateValue = {
      contractDate:       formValue.contract_date,
      nowDate:            DateHandler.getNowDate(),
      totalCount:         0, // 총 납입 횟수
      paidCount:          0, // 현재 납입 횟수
      totalPaidPremium:   0, // 총 납임금
      paidPremium:        0, // 현재까지 납입한 금액
      cancellationRefund: 0 // * 해약 환급금
    };
    const result         = {
      monthly_special_premium: 0, // * 월 특약 보험료
      monthly_earned_premium:  0  // * 월 적립 보험료
    };

    // 월 특약 보험료 계산
    if (formValue.monthly_premiums && formValue.monthly_contract_premium) {
      result.monthly_special_premium = Math.round(formValue.monthly_premiums - formValue.monthly_contract_premium);
    }

    // 월 적립 보험료 계산
    if (formValue.monthly_contract_premium) {
      if (formValue.refund_type === 1) { // 종신보험
        result.monthly_earned_premium = Math.round(formValue.monthly_contract_premium * 0.7);
      }

      if (formValue.refund_type === 2) { // 만기환급
        result.monthly_earned_premium = Math.round(formValue.monthly_contract_premium * 0.3);

      }

      if (formValue.refund_type === 3) { // 50%환급
        result.monthly_earned_premium = Math.round(formValue.monthly_contract_premium * 0.2);

      }

      if (formValue.refund_type === 4) { // 순수보장형
        result.monthly_earned_premium = 0;
      }
    }

    if (isNaN(result.monthly_special_premium) === false) {
      this.form.get('monthly_special_premium').setValue(result.monthly_special_premium);
    }
    if (formValue.payment_period_type === 1 && isNaN(result.monthly_earned_premium) === false) {
      this.form.get('monthly_earned_premium').setValue(result.monthly_earned_premium);
    } else {
      this.form.get('monthly_earned_premium').setValue(0);
    }
  }

  private _calculateWound(): void {
    const formValue      = this.form.value;
    const calculateValue = {
      contractDate:     formValue.contract_date,
      nowDate:          DateHandler.getNowDate(),
      totalCount:       0, // 총 납입 횟수
      paidCount:        0, // 현재 납입 횟수
      totalPaidPremium: 0, // 총 납임금
      paidPremium:      0 // 현재까지 납입한 금액
    };
    const result         = {
      monthly_premiums: 0  // * 월 납입 보험료
    };

    const monthly_assurance_premium = formValue.monthly_assurance_premium; // 보장 보험료
    const monthly_earned_premium    = formValue.monthly_earned_premium; // 적립 보험료
    const monthly_renewal_premium   = formValue.monthly_renewal_premium; // 갱신 보험료

    if (monthly_assurance_premium) {
      result.monthly_premiums = monthly_assurance_premium + monthly_earned_premium;
    } else {
      result.monthly_premiums = monthly_renewal_premium;
    }

    calculateValue.paidCount = DateHandler.getMonthsBetweenTwoDate(calculateValue.contractDate, calculateValue.nowDate);

    if (isNaN(result.monthly_premiums) === false) {
      this.form.get('monthly_premiums').setValue(result.monthly_premiums);
    }
  }

  onClickCustomer(id) {
    if (this['isShare']) {
      return;
    }

    this._router.navigateByUrl(`customer/${ id }`);
  }

  onGotoCustomerList() {
    if (this['isShare']) {
      return;
    }

    this._router.navigateByUrl('customer');
  }
}
