import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ApiUrl } from '../../core/constant/api.contant';
import { ApiService } from '../../core/service/api/api.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { LayoutHeaderService } from '../../layout/header/layout-header.service';
import { LayoutFooterService } from '../../layout/footer/layout-footer.service';
import { debounceTime } from 'rxjs/operators';
import { IUser } from '../../core/model/auth.model';
import { AuthService } from '../../core/service/auth/auth.service';
import { LayoutModalService } from '../../layout/modal/layout-modal.service';
import { AlertModalComponent } from '../../shared/modals/alert/alert-modal.component';


@AutoUnsubscribe()
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, OnDestroy {
  totalCount: number;
  customerList: any[] | undefined;
  searchControl: FormControl = new FormControl('');
  totalPageCount: number = 0;
  indexPage: number = 1;
  pagePerCount: number = 10;
  searchedKeyword: string = '';
  loginUser: IUser;

  private SCustomerListRequest: Subscription | undefined;

  constructor(
    private _apiService: ApiService,
    private _router: Router,
    private _headerService: LayoutHeaderService,
    private _footerService: LayoutFooterService,
    private _authService: AuthService,
    private _modalService: LayoutModalService
  ) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    this._headerService.show();
    this._footerService.show();
    this._requestCustomerList(1);
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(keyword => {
      this.searchedKeyword = keyword;
      this.indexPage = 1;
      this._requestCustomerList(1);
    })
  }

  ngOnDestroy(): void {
  }

  /******************************     event functions     ****************************/

  onClickCustomer(customerItem) {
    this._router.navigateByUrl('customer/' + customerItem.id)
  }

  onAddCustomer() {
    if (!this.loginUser?.user_membership && this.loginUser?.remain_add_user_count <= 0) {
      this._modalService.create(AlertModalComponent, {
        width: '320px',
        title: '고객을 더이상 추가할 수 없어요 !',
        body: '더 많은 고객을 추가하시고 싶으시다면 멤버십을 구입해 주세요 !<br/>가격 정책으로 이동 하시겠습니까?',
        btnCancelName: '아니요',
        btnConfirmName: '네',
        isConfirm: true,
        dismiss: () => {
          this._modalService.dismiss();
        },
        cancel: () => {
          this._modalService.dismiss();
        },
        confirm: () => {
          this._router.navigateByUrl('price');
          this._modalService.dismiss();
        }
      });
      return;
    }
    this._router.navigateByUrl('customer/create')
  }

  onPrevPage() {
    this.indexPage -= 1;
    this._requestCustomerList(this.indexPage);
  }

  onNextPage() {
    this.indexPage += 1;
    this._requestCustomerList(this.indexPage);
  }


  /******************************     request functions     ****************************/


  private _requestCustomerList(page) {
    this.SCustomerListRequest?.unsubscribe();

    const url = ApiUrl.getCustomerList;
    const params = {
      page,
      page_size: this.pagePerCount
    };

    if (this.searchedKeyword) {
      params['keyword'] = this.searchedKeyword;
    }

    this.SCustomerListRequest = this._apiService.get({
      url, params
    }).subscribe(res => {
        console.log('requestCustomerList res => ', res);
        this.customerList = res.results;
        this.totalCount = res.count;
        this.totalPageCount = Math.floor(this.customerList.length / this.pagePerCount + 1);
        this.SCustomerListRequest = null;
      }, error => {
        console.log('requestCustomerList error =>', error);
        this.SCustomerListRequest = null;
      });
  }

}
