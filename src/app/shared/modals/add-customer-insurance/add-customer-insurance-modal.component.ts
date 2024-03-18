import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiUrl } from '../../../core/constant/api.contant';
import { ApiService } from '../../../core/service/api/api.service';
import { AuthService } from '../../../core/service/auth/auth.service';
import { debounceTime, takeWhile } from 'rxjs/operators';
import { LayoutToastService } from '../../../layout/toast/layout-toast.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector:    'app-add-customer-insurance-modal',
  templateUrl: './add-customer-insurance-modal.component.html',
  styleUrls:   [ './add-customer-insurance-modal.component.scss' ]
})
export class AddCustomerInsuranceModalComponent implements OnInit, OnDestroy {
  @Input() customer: any;
  @Input() portfolioType: number;
  @Output() dismiss              = new EventEmitter();
  @Output() complete             = new EventEmitter();
  selectedTabName                = 'customer';
  searchFormControl: FormControl = new FormControl('');
  customerInsuranceList: any[] | undefined;
  insuranceTemplateList: any[] | undefined;
  searchKeyword: string;
  private SCustomerInsuranceRequest: Subscription | undefined;
  private SInsuranceTemplateRequest: Subscription | undefined;
  private SCopyInsuranceRequest: Subscription | undefined;

  constructor(
    private _apiService: ApiService,
    private _toastService: LayoutToastService,
    private _authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this._requestCustomerInsurance();
    this._requestInsuranceTemplate();
    this.searchFormControl.valueChanges.pipe(debounceTime(300)).subscribe(keyword => {
      this.searchKeyword = keyword;
      this._requestCustomerInsurance(keyword);
      this._requestInsuranceTemplate(keyword);
      // if (value === '') {
      //   this.showCustomerInsuranceList = this.customerInsuranceList.slice();
      //   this.showInsuranceTemplateList = this.insuranceTemplateList.slice();
      // } else {
      //   this.showCustomerInsuranceList = this.customerInsuranceList.filter(item => {
      //     const isInsuranceName = item.name.indexOf(value) !== -1;
      //     const isInsuredName = item.insured_name.indexOf(value) !== -1;
      //     return isInsuredName || isInsuranceName;
      //   });
      //   this.showInsuranceTemplateList = this.insuranceTemplateList.filter(item => item.name.indexOf(value) !== -1);
      // }
    });
  }

  ngOnDestroy(): void {
  }

  onClose() {
    this.dismiss.emit();
  }

  onSelectTab(selectedTabName) {
    this.selectedTabName = selectedTabName;
  }

  onClickInsurance(item: any) {
    item.checked = !item?.checked;
  }

  private _requestCustomerInsurance(keyword?: string) {
    this.SCustomerInsuranceRequest?.unsubscribe()

    this.customerInsuranceList = null;

    const url    = ApiUrl.getCustomerInsuranceList.replace(':id', this.customer.id.toString());
    const params = {
      portfolio_type: 1
    };
    if (keyword) {
      params['keyword'] = keyword;
    }

    this.SCustomerInsuranceRequest = this._apiService.get({
      url,
      params
    }).subscribe(res => {
      console.log('requestCustomerInsurance res => ', res);
      this.customerInsuranceList     = res.results;
      this.SCustomerInsuranceRequest = null;
    }, error => {
      console.log('requestCustomerInsurance error =>', error);
      this.SCustomerInsuranceRequest = null;
    });
  }

  private _requestInsuranceTemplate(keyword?: string) {
    this.SInsuranceTemplateRequest?.unsubscribe();

    this.insuranceTemplateList = null;

    const url    = ApiUrl.getInsuranceTemplateList;
    const params = {};

    if (keyword) {
      params['keyword'] = keyword;
    }

    this.SInsuranceTemplateRequest = this._apiService.get({
      url, params
    }).subscribe(res => {
      console.log('requestInsuranceTemplate res => ', res);

      this.insuranceTemplateList     = res.results;
      this.SInsuranceTemplateRequest = null;
    }, error => {
      console.log('requestInsuranceTemplate error =>', error);
      this.SInsuranceTemplateRequest = null;
    });
  }

  private _requestCopyInsurance() {
    if (this.SCopyInsuranceRequest) { // 연속 처리 방지
      return;
    }

    const url                   = ApiUrl.copyCustomerInsurance.replace(':id', this.customer.id);
    const customerInsuranceList = this.customerInsuranceList.filter(item => !!item.checked).map(item => item.id);
    const insuranceTemplateList = this.insuranceTemplateList.filter(item => !!item.checked).map(item => item.id);
    const body                  = {
      customer_insurance_list: customerInsuranceList.concat(insuranceTemplateList),
      portfolio_type:          this.portfolioType
    };

    this.SCopyInsuranceRequest = this._apiService.post({
      url,
      body
    }).subscribe(res => {
      console.log('requestCopyInsurance res => ', res);
      this.complete.emit();
      this.SCopyInsuranceRequest = null;
    }, error => {
      console.log('requestCopyInsurance error =>', error);
      this.SCopyInsuranceRequest = null;
    });
  }

  onSubmit() {
    const isSelected = this.insuranceTemplateList.some(item => item?.checked) || this.customerInsuranceList.some(item => item?.checked);
    if (!isSelected) {
      this._toastService.alert('보험 또는 설계를 선택해 주세요.');
      return;
    }

    this._requestCopyInsurance();
  }
}
