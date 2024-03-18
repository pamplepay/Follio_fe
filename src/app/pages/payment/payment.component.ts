import { Component, OnInit } from '@angular/core';
import { LayoutHeaderService } from '../../layout/header/layout-header.service';
import { LayoutFooterService } from '../../layout/footer/layout-footer.service';
import { Subscription } from 'rxjs';
import { ApiService } from '../../core/service/api/api.service';
import { ApiUrl } from '../../core/constant/api.contant';

@Component({
  selector:    'app-insurance',
  templateUrl: './payment.component.html',
  styleUrls:   [ './payment.component.scss' ]
})
export class PaymentComponent implements OnInit {
  paymentList: any;
  indexPage: any = 1;
  totalCount: number;
  totalPageCount: number;
  pageSize       = 10;
  private SPaymentListRequest: Subscription | undefined;

  constructor(
    private _headerService: LayoutHeaderService,
    private _footerService: LayoutFooterService,
    private _apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    this._headerService.show();
    this._footerService.show();

    this._requestPaymentList();
  }

  onClickPayment(customerItem: any) {

  }

  private _requestPaymentList() {
    this.SPaymentListRequest?.unsubscribe();

    const url                = ApiUrl.payment;
    const params             = {
      page:      this.indexPage,
      page_size: this.pageSize
    };
    this.SPaymentListRequest = this._apiService.get({
      url,
      params
    }).subscribe(res => {
      console.log('requestPaymentList res => ', res);
      this.paymentList         = res.results;
      this.totalCount          = res.count;
      this.totalPageCount      = Math.ceil(this.totalCount / this.pageSize);
      this.SPaymentListRequest = null;
    }, error => {
      console.log('requestPaymentList error =>', error);
      this.SPaymentListRequest = null;
    });
  }

  onPrevPage() {
    this.indexPage -= 1;
    this._requestPaymentList();
  }

  onNextPage() {
    this.indexPage += 1;
    this._requestPaymentList();
  }
}
