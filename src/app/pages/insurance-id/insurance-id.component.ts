import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IUser } from '../../core/model/auth.model';
import { AuthService } from '../../core/service/auth/auth.service';
import { LayoutHeaderService } from '../../layout/header/layout-header.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICommonInsurance, IDetail } from '../../core/model/common.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../core/service/common/common.service';
import { ApiService } from '../../core/service/api/api.service';
import { LayoutModalService } from '../../layout/modal/layout-modal.service';
import { LayoutToastService } from '../../layout/toast/layout-toast.service';
import { GlobalBlurHandler } from '../../core/handler/globar-blur-handler/globar-blur-handler';
import { Validator } from '../../core/validator/validator';
import { AlertModalComponent } from '../../shared/modals/alert/alert-modal.component';
import { Subscription } from 'rxjs';
import { ApiUrl } from '../../core/constant/api.contant';
import { DateHandler } from '../../core/handler/date-handler/date-handler';
import { combineLatest } from 'rxjs';
import { debounceTime, filter, startWith, takeWhile } from 'rxjs/operators';
import { LayoutFooterService } from '../../layout/footer/layout-footer.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { CustomerService } from '../../core/service/customer/customer.service';

@Component({
  selector:    'app-insurance-id',
  templateUrl: './insurance-id.component.html',
  styleUrls:   [ './insurance-id.component.scss' ]
})
export class InsuranceIdComponent implements OnInit, OnDestroy {
  private DetectRequest: Subscription | undefined;
  loginUser: IUser | undefined;
  form: FormGroup;
  commonInsurance: ICommonInsurance | undefined;
  caseForm: any | undefined      = {};
  lifeCaseForm                   = {};
  woundCaseForm: any | undefined = {};
  customerInsurance: any;
  insuranceNameList              = {};
  isShowValidLine: boolean       = false;
  customer: any;
  portfolioType: number;
  info: any
  percentList: number[]          = [
    120,
    110,
    100,
    90,
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    10,
    0
  ];
  thousandsMask: any             = {
    mask:               Number,
    thousandsSeparator: ','
  };

  new_detail: IDetail = {
    id: 0,
    name: '',
    order: 0,
    sub_category: 0,
    // 나머지 필드는 필요에 따라 초기화
  };

  private SCreateCustomerInsuranceRequest: Subscription | undefined;
  private SUpdateCustomerInsuranceRequest: Subscription | undefined;
  private SDeleteCustomerInsuranceRequest: Subscription | undefined;
  private isUnsubscribe: boolean = false;
  isLoading = false; // 로딩 상태 관리
  private detail_data;

  constructor(
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _commonService: CommonService,
    private _apiService: ApiService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _modalService: LayoutModalService,
    private _headerService: LayoutHeaderService,
    private _toastService: LayoutToastService,
    private _clipboard: Clipboard,
    private _customerService: CustomerService,
    private _changeDetectRef: ChangeDetectorRef,
    private _footerService: LayoutFooterService
  ) {
  }

  ngOnInit(): void {
    this._headerService.show();
    this._footerService.show();
    this._customerService.rxSelectedCustomer().pipe(takeWhile(() => this.isUnsubscribe === false)).subscribe(customer => {
      console.log('customer', customer, customer.id);
      if (customer) {
        this.customer = customer;
      }
    });

    this.loginUser     = this._authService.getLoginUser();
    this.portfolioType = this._route.snapshot.queryParams['portfolioType'];
    this.info = this._route.snapshot.queryParams['info'];

    this.customerInsurance = this._route.snapshot.data?.customerInsurance;
    if (this.customerInsurance) {
      console.log('this.customerInsurance', this.customerInsurance);
      this.customer = {
        id: this.customerInsurance?.customer,
        name: this.customerInsurance?.customer_name
      };
    }

    console.log('this.customer', this.customer);

    // jhpark_20231229_S
    if (this.info.length > 0) {
      const url                              = ApiUrl.detect;

      const body = {
        info: this.info,
      };
      this.DetectRequest = this._apiService.post({
        url,
        body,
        isLoading:true,
      }).subscribe(res => {
        console.log('DetectRequest res => ', res);
        if (res.loss_head !== undefined) {
          this.selectLossInsurance(res.loss_head);
        }
        if (res.life_head !== undefined) {
          this.selectLifeInsurance(res.life_head);
        }
        if (res.detail_data !== undefined) {
          //this.changeCommonService(res.detail_data);
          this.populateDetailData(res.detail_data);
        }
        // 200ms 후에 _calculateWound 함수 실행
        setTimeout(() => {
          this._calculateWound();
        }, 200);
      }, error => {
        console.log('DetectRequest error =>', error);
        this.DetectRequest = null;
      });
    }
    // jhpark_20231229_E

    this._commonService.rxInsurance().subscribe(insurance => {
      this.commonInsurance = insurance;
      console.log('this.commonInsurance, this.form', this.commonInsurance, this.form);

      this.commonInsurance.insurance_list.forEach(insuranceItem => {
        this.insuranceNameList[insuranceItem.id] = insuranceItem.name;
      });

      console.log('this.form 1', this.form);

      if (!this.form) {
        this.form = this._getCustomerInsuranceForm(this.customerInsurance);
        console.log('this.form 2', this.form);
        this.subscribeFormChanges();
        this._initRequired(this.customerInsurance?.insurance_type);
      }
    });
  }

  // jhpark_20240129_S
  private populateDetailData(detailData: any) {
    Object.keys(detailData).forEach(categoryKey => {
      const subcategory = detailData[categoryKey];
  
      // 카테고리가 객체인지 확인
      const subcategoryKeys = Object.keys(subcategory);
      for (const subcategoryKey of subcategoryKeys) {
          const subsubcategory = subcategory[subcategoryKey];
  
          const subsubcategoryKeys = Object.keys(subsubcategory);
          for (const subsubcategoryKey of subsubcategoryKeys) {
              const arrdata = subsubcategory[subsubcategoryKey];
              if (arrdata.length > 0) {
                  console.log(arrdata);
                  for (let i = 0; i < arrdata.length; i++) {
                    if (i > 0) {
                      // const last_id = Object.keys(this.caseForm).reduce((sum, key) => {
                      //   return sum + this.caseForm[key].length;
                      // }, 0);
                      
                      // this.new_detail.id = last_id;
                      const category = this.commonInsurance.categories.find(cat => cat.name === categoryKey);
                      if (category) {
                        const subcategory = category.sub_category_list.find(subcat => subcat.name === subcategoryKey);
                        if (subcategory.detail_list) {
                          console.log(subcategory.detail_list);
                          this.new_detail.id = subcategory.detail_list[0].id;
                          this.onAddCase(this.new_detail);
                        }
                      }
                    }
                    let detailString = arrdata[i];
                    const parts = detailString.split(':');
                    this.findAndProcessDetail(categoryKey, subcategoryKey, subsubcategoryKey, i, parts);
                  }
              }
          }
      }
  });
}


  //   Object.keys(detailData).forEach(categoryName => {
  //     const detailList = detailData[categoryName];
  //     detailList.forEach(detailString => {
  //       const parts = detailString.split(':');
  //       this.findAndProcessDetail(categoryName, parts);
  //     });
  //   });
  // }

  private findAndProcessDetail(categoryKey: string, subcategoryKey: string, subsubcategoryKey: string, index: number, parts: string[]) {
    const category = this.commonInsurance.categories.find(cat => cat.name === categoryKey);
    if (category) {
      const subcategory = category.sub_category_list.find(subcat => subcat.name === subcategoryKey);
      if (subcategory.detail_list) {
        const detail = subcategory.detail_list.find(subcat => subcat.name.includes(subsubcategoryKey));
        if (detail) {
        //for  (const detail of subcategory.detail_list) {
          console.log(parts)
          if (parts.length > 3) {
            this.caseForm[detail.id][index].get('payment_period').setValue(parseInt(parts[0]));
            this.caseForm[detail.id][index].get('payment_period_type').setValue(parseInt(parts[1]));
            this.caseForm[detail.id][index].get('warranty_period').setValue(parseInt(parts[2]));
            this.caseForm[detail.id][index].get('warranty_period_type').setValue(parseInt(parts[3]));
            this.caseForm[detail.id][index].get('premium').setValue(parseInt(parts[4]));
          }
          else {
            this.caseForm[detail.id][index].get('premium').setValue(parseInt(parts[1]));
          }
        // for (const detail of subsubcategory) {
        //   // category.sub_category_list.forEach(subCategory => {
        //   //   subCategory.detail_list.forEach(detail => {
        //       //if (parts[0].includes(detail.name)) {
        //       if (parts.length > 4) {
        //         if (detail.name.includes(parts[0])) {
        //           this.caseForm[detail.id][0].get('payment_period').setValue(parseInt(parts[1]));
        //           this.caseForm[detail.id][0].get('warranty_period').setValue(parseInt(parts[3]));
        //           this.caseForm[detail.id][0].get('premium').setValue(parseInt(parts[5]));
        //           // Process matched detail. Implement your logic here.
        //           console.log(`Found match for ${parts[0]} in ${detail.name}`);
        //           // Example: Use parts array to extract and process relevant data.
        //         }
        //       }
        //       else {
        //         if (detail.name.includes(parts[0])) {
        //           this.caseForm[detail.id][0].get('premium').setValue(parseInt(parts[1]));
        //           // Process matched detail. Implement your logic here.
        //           console.log(`Found match for ${parts[0]} in ${detail.name}`);
        //           // Example: Use parts array to extract and process relevant data.
        //         }
        //       }
        }
      }
    }
  }
      //   if (subCategory.name.includes)
      //   for (const detail of subCategory.detail_list) {
      // // category.sub_category_list.forEach(subCategory => {
      // //   subCategory.detail_list.forEach(detail => {
      //     //if (parts[0].includes(detail.name)) {
      //     if (parts.length > 4) {
      //       if (detail.name.includes(parts[0])) {
      //         this.caseForm[detail.id][0].get('payment_period').setValue(parseInt(parts[1]));
      //         this.caseForm[detail.id][0].get('warranty_period').setValue(parseInt(parts[3]));
      //         this.caseForm[detail.id][0].get('premium').setValue(parseInt(parts[5]));
      //         // Process matched detail. Implement your logic here.
      //         console.log(`Found match for ${parts[0]} in ${detail.name}`);
      //         // Example: Use parts array to extract and process relevant data.
      //       }
      //     }
      //     else {
      //       if (detail.name.includes(parts[0])) {
      //         this.caseForm[detail.id][0].get('premium').setValue(parseInt(parts[1]));
      //         // Process matched detail. Implement your logic here.
      //         console.log(`Found match for ${parts[0]} in ${detail.name}`);
      //         // Example: Use parts array to extract and process relevant data.
      //       }
      //     }
      //   }
      //}
  //   }
  // }
  // jhpark_20240129_E

  ngOnDestroy(): void {
    this.isUnsubscribe = true;
  }

  selectLifeInsurance(life_head) {
    // 'insurance_type'을 상해보험(2)으로 설정
    this.form.get('insurance_type').setValue(1);
  
    // 'commonInsurance?.life_insurance_list'의 두 번째 항목의 id를 찾아서 설정
    const lifeInsuranceList = this.commonInsurance?.life_insurance_list;
    if (lifeInsuranceList && life_head.생명보험 < lifeInsuranceList.length) {
      const selectedItem = lifeInsuranceList[life_head.생명보험];
      this.form.get('insurance').setValue(selectedItem.id);
    }
    this.form.get('name').setValue(life_head.상품명);
    this.form.get('contractor_name').setValue(life_head.계약자);
    this.form.get('payment_period').setValue(life_head.납입기간);
    if (life_head.계약자.includes(life_head.피보험자)) {
      this.form.get('insured_name').setValue(life_head.계약자);
      this.form.get('is_same_insured').setValue(true);
    }
    else {
      this.form.get('insured_name').setValue(life_head.피보험자);
    }
    this.form.get('warranty_period').setValue(life_head.보장기간);
    this.form.get('contract_date').setValue(life_head.계약일);
    this.form.get('expiry_date').setValue(life_head.만기일);
    this.caseForm = this.lifeCaseForm;
  }

  selectLossInsurance(loss_head) {
    // 'insurance_type'을 손해보험(2)으로 설정
    this.form.get('insurance_type').setValue(2);
  
    // 'commonInsurance?.loss_insurance_list'의 두 번째 항목의 id를 찾아서 설정
    const lossInsuranceList = this.commonInsurance?.loss_insurance_list;
    if (lossInsuranceList && loss_head.손해보험 < lossInsuranceList.length) {
      const selectedItem = lossInsuranceList[loss_head.손해보험];
      this.form.get('insurance').setValue(selectedItem.id);
    }
    this.form.get('name').setValue(loss_head.상품명);
    this.form.get('contractor_name').setValue(loss_head.계약자);
    this.form.get('payment_period').setValue(loss_head.납입기간);
    if (loss_head.계약자.includes(loss_head.피보험자)) {
      this.form.get('insured_name').setValue(loss_head.계약자);
      this.form.get('is_same_insured').setValue(true);
    }
    else {
      this.form.get('insured_name').setValue(loss_head.피보험자);
    }
    this.form.get('warranty_period').setValue(loss_head.보장기간);

    this.form.get('monthly_assurance_premium').setValue(loss_head.월보장보험료);
    this.form.get('contract_date').setValue(loss_head.계약일);
    this.form.get('monthly_renewal_premium').setValue(loss_head.월갱신보험료);
    this.form.get('expiry_date').setValue(loss_head.만기일);
    this.form.get('monthly_earned_premium').setValue(loss_head.월적립보험료);
    //this.form.get('cancellation_refund').setValue(loss_head.해약환급금);
    this.form.get('monthly_premiums').setValue(loss_head.월납입보험료);
    this.form.get('renewal_growth_rate').setValue(loss_head.갱신증가율);
    this.caseForm = this.woundCaseForm;
  }

  changeCommonService(detail_data) {
    this.detail_data = detail_data;
    this.caseForm.forEach(caseform => {
      console.log(caseform)
    })
  }

  /******************************     event functions     ****************************/

  onBack() {
    history.back();
  }

  onGotoAnalysis() {
    this._router.navigateByUrl('insurance/' + this.customerInsurance.id + '/analysis');
  }

  onCopyUrl() {
    GlobalBlurHandler.blur();
    this._clipboard.copy(location.href);
    this._toastService.alert('링크가 복사 되었습니다.');
  }

  onClickSameName($event) {
    $event.stopPropagation();
    const contractorName = this.form.get('contractor_name').value;
    const insuredName    = this.form.get('insured_name').value;
    if (contractorName !== insuredName) {
      this.form.get('insured_name').setValue(contractorName);
      this.form.get('insured_name').updateValueAndValidity();
    }
  }

  onChangeSameInsured($event: any) {
    const contractorName = this.form.get('contractor_name').value;
    const insuredName    = this.form.get('insured_name').value;
    if (contractorName === insuredName) {
      $event.target.checked = !$event.target.checked;
    }

  }

  onSubmit() {
    this.isShowValidLine = true;
    console.log(this.form);
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
    const insuranceType     = this.form.get('insurance_type').value;
    const caseFormList: any = insuranceType === 1 ? Object.values(this.caseForm).reduce((a: any[], b: any[]) => a.concat(b), []) : Object.values(this.caseForm).reduce((a: any[], b: any[]) => a.concat(b), []);
    const caseList          = caseFormList.map(form => form.value);

    if (!formValue.renewal_growth_rate) {
      formValue.renewal_growth_rate = 3;
    }

    if (!formValue.id) {
      this._requestCreateCustomerInsurance(formValue, caseList);
    } else {
      this._requestUpdateCustomerInsurance(formValue, caseList);
    }

  }

  onDeleteInsurance() {
    this._modalService.create(AlertModalComponent, {
      title:     '삭제하기',
      body:      '정말 삭제 하시겠어요?',
      isConfirm: true,
      dismiss:   () => this._modalService.dismiss(),
      cancel:    () => this._modalService.dismiss(),
      confirm:   () => {
        this._requestDeleteCustomerInsurance();
        this._modalService.dismiss();
      }
    });
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
    const caseItem = this.caseForm[caseDetailItem.id].splice(caseFormIndex, 1)[0];
  }

  onFocusMonthlyEarnedPremium($event) {
    console.log('onFocusMonthlyEarnedPremium', $event);
    if ($event.target.value == '0') {
      this.form.get('monthly_earned_premium').setValue('');
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

  /******************************     request functions     ****************************/

  private _requestUpdateCustomerInsurance(value, caseList) {
    if (this.SUpdateCustomerInsuranceRequest) { // 연속 처리 방지
      return;
    }

    const url         = ApiUrl.updateCustomerInsurance.replace(':id', this.customerInsurance.id.toString());
    const body        = value;
    body['case_list'] = caseList;

    this.SUpdateCustomerInsuranceRequest = this._apiService.patch({
      url,
      body
    }).subscribe(res => {
      console.log('requestUpdateCustomerInsurance res => ', res);
      this._toastService.alert('업데이트 되었습니다.');
      this.SUpdateCustomerInsuranceRequest = null;
    }, error => {
      console.log('requestUpdateCustomerInsurance error =>', error);
      this.SUpdateCustomerInsuranceRequest = null;
    });
  }


  private _requestDeleteCustomerInsurance() {
    if (this.SDeleteCustomerInsuranceRequest) { // 연속 처리 방지
      return;
    }

    const url                            = ApiUrl.deleteCustomerInsurance.replace(':id', this.customerInsurance.id.toString());
    this.SDeleteCustomerInsuranceRequest = this._apiService.delete({
      url
    }).subscribe(res => {
      console.log('requestDeleteCustomerInsurance res => ', res);
      this._toastService.alert('삭제 되었습니다.');
      this._router.navigateByUrl('customer/' + this.customerInsurance.customer);
      this.SDeleteCustomerInsuranceRequest = null;
    }, error => {
      console.log('requestDeleteCustomerInsurance error =>', error);
      this.SDeleteCustomerInsuranceRequest = null;
    });
  }

  /******************************     etc functions     ****************************/

  private _getCustomerInsuranceForm(customerInsurance: any) {
    const result = this._formBuilder.group({
      user:           this.loginUser?.id,
      id:             customerInsurance?.id || null,
      insurance:      [
        customerInsurance?.insurance || null,
        Validators.required
      ],
      insurance_type: customerInsurance?.insurance_type || 1,
      customer:       customerInsurance?.customer || this.customer?.id,
      name:           [
        customerInsurance?.name || '',
        [
          Validators.required
        ]
      ],

      contractor_name:      [
        customerInsurance?.contractor_name || '',
        [
          Validators.required,
          Validator.kor()
        ]
      ],
      insured_name:         [
        customerInsurance?.insured_name || '',
        [
          Validators.required,
          Validator.kor()
        ]
      ],
      is_same_insured:      customerInsurance?.is_same_insured || true,
      portfolio_type:       customerInsurance?.portfolio_type || this.portfolioType || 1,
      info:                 this.info,
      payment_period_type:  customerInsurance?.payment_period_type || 1,
      payment_period:       [
        customerInsurance?.payment_period || '',
        [
          Validators.required,
          Validator.num()
        ]
      ],
      warranty_period_type: customerInsurance?.warranty_period_type || 1,
      warranty_period:      [
        customerInsurance?.warranty_period || null,
        customerInsurance?.warranty_period_type === 3 ? [] : [
          Validators.required,
          Validator.num()
        ]
      ],
      contract_date:        [
        customerInsurance?.contract_date || '',
        [
          Validators.required,
          Validator.date()
        ]
      ],
      expiry_date:          [
        customerInsurance?.expiry_date || '',
        [
          Validators.required,
          Validator.date()
        ]
      ],
      refund_type:          customerInsurance?.refund_type || 4,

      monthly_assurance_premium: [
        customerInsurance?.monthly_assurance_premium || null,
        [
          Validator.num()
        ]
      ],
      monthly_renewal_premium:   [
        customerInsurance?.monthly_renewal_premium || null,
        [ Validator.num() ]
      ],
      monthly_special_premium:   [
        customerInsurance?.monthly_special_premium || null,
        [ Validator.num() ]
      ],
      monthly_premiums:          [
        customerInsurance?.monthly_premiums || null,
        [ Validator.num() ]
      ],
      renewal_special_expiry:    [
        customerInsurance?.renewal_special_expiry || null,
        [ Validator.num() ]
      ],

      monthly_contract_premium:    [
        customerInsurance?.monthly_contract_premium || null,
        [ Validator.num() ]
      ],
      monthly_earned_premium:      [
        customerInsurance?.monthly_earned_premium || null,
        [ Validator.num() ]
      ],
      cancellation_refund:         [
        customerInsurance?.cancellation_refund || null,
        [ Validator.num() ]
      ],
      renewal_growth_rate:         [
        customerInsurance?.renewal_growth_rate || 3,
        [ Validator.num() ]
      ],
      percent_cancellation_refund: customerInsurance?.percent_cancellation_refund || 120,
      comment_title:               customerInsurance?.comment_title || '',
      comment:                     customerInsurance?.comment || ''
    });

    this.commonInsurance.categories.forEach(categoryItem => {
      categoryItem.sub_category_list.forEach(subCategory => {
        subCategory.detail_list.forEach(detail => {
          console.log('subCategory.insurance_type', subCategory.insurance_type);
          this.lifeCaseForm[detail.id]  = [];
          this.woundCaseForm[detail.id] = [];

          const insuranceCaseList = this.customerInsurance?.case_list?.filter(insuranceCase => insuranceCase.detail === detail.id);

          if (insuranceCaseList?.length > 0) {
            insuranceCaseList.forEach(item => {
              const caseForm = this._getCaseForm(detail, item);
              if (subCategory.insurance_type === 1) {
                this.lifeCaseForm[detail.id].push(caseForm);
              } else if (subCategory.insurance_type === 2) {
                this.woundCaseForm[detail.id].push(caseForm);
              } else {
                this.woundCaseForm[detail.id].push(caseForm);
                this.lifeCaseForm[detail.id].push(caseForm);
              }
            });
          } else {
            const caseForm = this._getCaseForm(detail);
            if (subCategory.insurance_type === 1) {
              this.lifeCaseForm[detail.id].push(caseForm);
            } else if (subCategory.insurance_type === 2) {
              this.woundCaseForm[detail.id].push(caseForm);
            } else {
              this.woundCaseForm[detail.id].push(caseForm);
              this.lifeCaseForm[detail.id].push(caseForm);
            }
          }
        });
      });
    });

    this.caseForm = result.get('insurance_type').value === 1 ? this.lifeCaseForm : this.woundCaseForm;
    console.log('this.caseForm', this.caseForm);

    return result;
  }

  private _initRequired(type: any = 1) {
    if (type === 1) {
      this.form.get('monthly_contract_premium').setValidators([
        Validators.required,
        Validator.num()
      ]);
      this.form.get('monthly_premiums').setValidators([
        Validators.required,
        Validator.num()
      ]);
      this.form.get('monthly_assurance_premium').clearValidators();
      this.form.get('monthly_assurance_premium').updateValueAndValidity();
      this.form.get('expiry_date').clearValidators();
      this.form.get('expiry_date').updateValueAndValidity();
    }

    if (type === 2) {
      this.form.get('monthly_assurance_premium').setValidators([
        Validators.required,
        Validator.num()
      ]);

      this.form.get('monthly_premiums').clearValidators();
      this.form.get('monthly_contract_premium').clearValidators();
      this.form.get('monthly_contract_premium').updateValueAndValidity();

      if (this.form.get('warranty_period_type').value === 3) {
        this.form.get('warranty_period_type').setValue(1);
      }

      this.form.get('expiry_date').setValidators([
        Validators.required,
        Validator.date()
      ]);
    }
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

  private subscribeFormChanges() {
    combineLatest([
      this.form.get('contractor_name').valueChanges.pipe(startWith(this.form.get('contractor_name').value)),
      this.form.get('insured_name').valueChanges.pipe(startWith(this.form.get('insured_name').value))
    ]).subscribe(value => {
      this.form.get('is_same_insured').setValue(value[0] === value[1]);
    });

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
      this.form.get('refund_type').valueChanges.pipe(startWith(null)),
      this.form.get('percent_cancellation_refund').valueChanges.pipe(startWith(null)),
      this.form.get('contract_date').valueChanges.pipe(startWith(null)),
      this.form.get('payment_period_type').valueChanges.pipe(startWith(null)),
      this.form.get('warranty_period').valueChanges.pipe(startWith(null))
    ]).pipe(debounceTime(10)).subscribe((value: any) => {
      this.form.updateValueAndValidity();
      if (this.form.value.insurance_type === 1) {
        this.caseForm = this.lifeCaseForm;
        this._calculateLife();
      } else {
        this.caseForm = this.woundCaseForm;
        this._calculateWound();
      }
    });

    this.form.get('warranty_period_type').valueChanges.subscribe(value => {
      if (value === 3) {
        this.form.get('warranty_period').setValue(null);
        this.form.get('warranty_period').clearValidators();
        this.form.get('warranty_period').updateValueAndValidity();
      } else {
        this.form.get('warranty_period').setValidators([
          Validators.required,
          Validator.num()
        ]);
      }
    });
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
      cancellation_refund:     0, // * 해약 환급금
      monthly_special_premium: 0, // * 월 특약 보험료
      monthly_earned_premium:  0  // * 월 적립 보험료
    };

    if (calculateValue.contractDate?.length === 10) {
      calculateValue.paidCount = DateHandler.getMonthsBetweenTwoDate(calculateValue.contractDate, calculateValue.nowDate);
      if (formValue.payment_period) {
        calculateValue.totalCount       = formValue.payment_period * 12;  // 납입 기간이 년이면 "납입 기간" * 12
        calculateValue.totalPaidPremium = calculateValue.totalCount * formValue.monthly_premiums;
        if (formValue.payment_period_type === 1 && calculateValue.paidCount > calculateValue.totalCount) {
          calculateValue.paidCount = calculateValue.totalCount;
        }

        calculateValue.paidPremium = calculateValue.paidCount * formValue.monthly_premiums;
        result.cancellation_refund = Math.round(calculateValue.paidPremium * (formValue?.percent_cancellation_refund / 100));
      }
    }

    if (formValue.monthly_premiums && formValue.monthly_contract_premium) {
      result.monthly_special_premium = Math.round(formValue.monthly_premiums - formValue.monthly_contract_premium);
    }

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
    if (isNaN(result.cancellation_refund) === false) {
      this.form.get('cancellation_refund').setValue(result.cancellation_refund);
    }
    if (isNaN(result.monthly_earned_premium) === false) {
      this.form.get('monthly_earned_premium').setValue(result.monthly_earned_premium);
    }

    // console.log('result', result, calculateValue);
  }

  private _calculateWound(): void {
    console.log('_calculateWound');
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
      cancellation_refund: 0, // * 해약 환급금
      monthly_premiums:    0  // * 월 납입 보험료
    };

    const monthly_assurance_premium = formValue.monthly_assurance_premium; // 보장 보험료
    const monthly_earned_premium    = formValue.monthly_earned_premium; // 적립 보험료
    const monthly_renewal_premium   = formValue.monthly_renewal_premium; // 갱신 보험료

    if (monthly_assurance_premium) {
      result.monthly_premiums = monthly_assurance_premium + monthly_earned_premium;
    } else {
      result.monthly_premiums = monthly_renewal_premium;
    }

    if (calculateValue.contractDate?.length === 10) {
      calculateValue.paidCount = DateHandler.getMonthsBetweenTwoDate(calculateValue.contractDate, calculateValue.nowDate);
      if (formValue.payment_period) {
        calculateValue.totalCount       = formValue.payment_period * 12;  // 납입 기간이 년이면 "납입 기간" * 12
        calculateValue.totalPaidPremium = calculateValue.totalCount * formValue.monthly_premiums;
        if (formValue.payment_period_type === 1 && calculateValue.paidCount > calculateValue.totalCount) {
          calculateValue.paidCount = calculateValue.totalCount;
        }
        calculateValue.paidPremium = calculateValue.paidCount * formValue.monthly_premiums;
        result.cancellation_refund = Math.round(calculateValue.paidPremium * (formValue?.percent_cancellation_refund / 100));
      }
    }

    if (isNaN(result.monthly_premiums) === false && result.monthly_premiums > 0) {
      this.form.get('monthly_premiums').setValue(result.monthly_premiums);
    }
    if (isNaN(result.cancellation_refund) === false && result.cancellation_refund > 0) {
      this.form.get('cancellation_refund').setValue(result.cancellation_refund);
    }
  }

  private _requestCreateCustomerInsurance(value, caseList) {
    if (this.SCreateCustomerInsuranceRequest) { // 연속 처리 방지
      return;
    }

    const url         = ApiUrl.createCustomerInsurance;
    const body        = value;
    body['case_list'] = caseList;

    this.SCreateCustomerInsuranceRequest = this._apiService.post({
      url,
      body
    }).subscribe(res => {
      console.log('requestCreateCustomerInsurance res => ', res);
      this._router.navigateByUrl('insurance/' + res.id);
      this.SCreateCustomerInsuranceRequest = null;
    }, error => {
      console.log('requestCreateCustomerInsurance error =>', error);
      this.SCreateCustomerInsuranceRequest = null;
    });
  }
}
