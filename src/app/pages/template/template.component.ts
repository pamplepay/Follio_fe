import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiUrl } from '../../core/constant/api.contant';
import { ApiService } from '../../core/service/api/api.service';
import { CommonService } from '../../core/service/common/common.service';
import { ICommonInsurance } from '../../core/model/common.model';
import { IInsuranceTemplate } from '../../core/model/Insurance-template.model';
import { LayoutHeaderService } from '../../layout/header/layout-header.service';
import { LayoutFooterService } from '../../layout/footer/layout-footer.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../core/service/customer/customer.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector:    'app-template',
  templateUrl: './template.component.html',
  styleUrls:   [ './template.component.scss' ]
})
export class TemplateComponent implements OnInit {
  private SInsuranceTemplateRequest: Subscription | undefined;
  insuranceTemplateList: IInsuranceTemplate[] | undefined;
  totalCount: number | undefined;
  indexPage: any = 1;
  totalPageCount: number;
  pageSize       = 9;
  commonInsurance: ICommonInsurance;
  searchControl = new FormControl('');
  searchedKeyword: string;

  constructor(
    private _apiService: ApiService,
    private _commonService: CommonService,
    private _headerService: LayoutHeaderService,
    private _router: Router,
    private _customerService: CustomerService,
    private _footerService: LayoutFooterService
  ) {
  }

  ngOnInit(): void {
    console.log('template list ngOnInit', this.insuranceTemplateList?.length);
    this._headerService.show();
    this._footerService.show();

    this._requestInsuranceTemplate(1);
    this._commonService.rxInsurance().subscribe(commonInsurance => {
      this.commonInsurance = commonInsurance;
    })

    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(keyword => {
      this.searchedKeyword = keyword;
      this.indexPage = 1;
      this._requestInsuranceTemplate(1);
    })
  }


  private _requestInsuranceTemplate(page) {
    this.SInsuranceTemplateRequest?.unsubscribe();

    const url = ApiUrl.getInsuranceTemplateList;

    const params = {
      page,
      page_size: this.pageSize
    };

    if (this.searchedKeyword) {
      params['keyword'] = this.searchedKeyword;
    }

    this.SInsuranceTemplateRequest = this._apiService.get({
      url,
      params
    }).subscribe(res => {
      console.log('requestInsuranceTemplate res => ', res);
      this.insuranceTemplateList     = res.results;
      this.totalCount                = res.count;
      this.totalPageCount      = Math.ceil(this.totalCount / this.pageSize);
      this.SInsuranceTemplateRequest = null;
    }, error => {
      console.log('requestInsuranceTemplate error =>', error);
      this.SInsuranceTemplateRequest = null;
    });
  }


  onPrevPage() {
    this.indexPage -= 1;
    this._requestInsuranceTemplate(this.indexPage);
  }

  onNextPage() {
    this.indexPage += 1;
    this._requestInsuranceTemplate(this.indexPage);
  }

  onGotoTemplateCreate() {
    this._customerService.setSelectedCustomer(null);
    this._router.navigateByUrl('/template/create?isTemplate=true');
  }
}
