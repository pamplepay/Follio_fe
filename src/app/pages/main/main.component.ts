import { Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutToastService } from '../../layout/toast/layout-toast.service';
import { LayoutHeaderService } from '../../layout/header/layout-header.service';
import { Subscription } from 'rxjs';
import { ApiService } from '../../core/service/api/api.service';
import { ApiUrl } from '../../core/constant/api.contant';
import { Router } from '@angular/router';
import { LayoutFooterService } from '../../layout/footer/layout-footer.service';
import { FormControl } from '@angular/forms';

@Component({
  selector:    'app-main',
  templateUrl: './main.component.html',
  styleUrls:   [ './main.component.scss' ]
})
export class MainComponent implements OnInit, OnDestroy {

  customerList: any[];
  customerInsuranceList: any[];
  insuranceTemplateList: any[];

  private SCustomerListRequest: Subscription | undefined;
  private SLastViewInsuranceListRequest: Subscription | undefined;
  private SLastViewInsuranceTemplateRequest: Subscription | undefined;

  constructor(
    private _headerService: LayoutHeaderService,
    private _footerService: LayoutFooterService,
    private _toastService: LayoutToastService,
    private _router: Router,
    private _apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    this._headerService.show();
    this._footerService.show();
    this._requestCustomerList();
    this._requestLastViewInsuranceList();
    this._requestLastViewInsuranceTemplate();
  }

  ngOnDestroy(): void {
  }

  onAddCustomer() {
    this._router.navigateByUrl('customer/create');
  }

  private _requestCustomerList() {
    if (this.SCustomerListRequest) { // 연속 처리 방지
      return;
    }

    const url                 = ApiUrl.getLastViewCustomerList;
    const params              = {
      page:      1,
      page_size: 7
    };
    this.SCustomerListRequest = this._apiService.get({
      url,
      params
    }).subscribe(res => {
      console.log('requestCustomerList res => ', res);
      this.customerList = res.results;

      this.SCustomerListRequest = null;
    }, error => {
      console.log('requestCustomerList error =>', error);
      this.SCustomerListRequest = null;
    });
  }

  private _requestLastViewInsuranceList() {
    if (this.SLastViewInsuranceListRequest) { // 연속 처리 방지
      return;
    }

    const url                          = ApiUrl.getLastViewCustomerInsuranceList;
    const params                       = {
      page:      1,
      page_size: 3
    };
    this.SLastViewInsuranceListRequest = this._apiService.get({
      url,
      params
    }).subscribe(res => {
      console.log('requestLastViewInsuranceList res => ', res);
      this.customerInsuranceList = res.results;

      this.SLastViewInsuranceListRequest = null;
    }, error => {
      console.log('requestLastViewInsuranceList error =>', error);
      this.SLastViewInsuranceListRequest = null;
    });
  }

  private _requestLastViewInsuranceTemplate() {
    if (this.SLastViewInsuranceTemplateRequest) { // 연속 처리 방지
      return;
    }

    const url                              = ApiUrl.getLastViewInsuranceTemplateList;
    const params                           = {
      page:      1,
      page_size: 3
    };
    this.SLastViewInsuranceTemplateRequest = this._apiService.get({
      url,
      params
    }).subscribe(res => {
      console.log('requestLastViewInsuranceTemplate res => ', res);
      this.insuranceTemplateList = res.results;

      this.SLastViewInsuranceTemplateRequest = null;
    }, error => {
      console.log('requestLastViewInsuranceTemplate error =>', error);
      this.SLastViewInsuranceTemplateRequest = null;
    });
  }

  onGotoCustomerInsurance(customerInsuranceItem: any) {
    this._router.navigateByUrl(`insurance/${customerInsuranceItem.id}`);
  }
}
