import { Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutToastService } from '../../layout/toast/layout-toast.service';
import { IUser } from '../../core/model/auth.model';
import { AuthService } from '../../core/service/auth/auth.service';
import { LayoutModalService } from '../../layout/modal/layout-modal.service';
import { CustomerInfoModalComponent } from '../../shared/modals/customer-info/customer-info-modal.component';
import { CaseHistoryModalComponent } from '../../shared/modals/case-history/case-history-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutHeaderService } from '../../layout/header/layout-header.service';
import { AddCustomerInsuranceModalComponent } from '../../shared/modals/add-customer-insurance/add-customer-insurance-modal.component';
import { GroupCustomerModalComponent } from '../../shared/modals/group-customer/group-customer-modal.component';
import { AlertModalComponent } from '../../shared/modals/alert/alert-modal.component';
import { ApiUrl } from '../../core/constant/api.contant';
import { Subscription } from 'rxjs';
import { ApiService } from '../../core/service/api/api.service';
import { LayoutFooterService } from '../../layout/footer/layout-footer.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { GlobalBlurHandler } from '../../core/handler/globar-blur-handler/globar-blur-handler';
import { CustomerService } from '../../core/service/customer/customer.service';
import { debounceTime, takeWhile } from 'rxjs/operators';

@Component({
  selector:    'app-customer-id',
  templateUrl: './customer-id.component.html',
  styleUrls:   [ './customer-id.component.scss' ]
})
export class CustomerIdComponent implements OnInit, OnDestroy {
  loginUser: IUser | undefined;
  customer: any;
  existingInsuranceList: any[];
  suggestInsuranceList: any[];
  groupCustomerList: any[];
  existingTotal: number;
  suggestTotal: number;
  isUnsubscribe = false;
  private SCreateCustomerInsuranceRequest: Subscription | undefined;
  private SCustomerInsuranceExistingRequest: Subscription | undefined;
  private SCustomerInsuranceSuggestRequest: Subscription | undefined;
  private SDeleteCustomerRequest: Subscription | undefined;
  private SGroupCustomerListRequest: Subscription | undefined;

  constructor(
    private _route: ActivatedRoute,
    private _apiService: ApiService,
    private _toastService: LayoutToastService,
    private _clipboard: Clipboard,
    private _router: Router,
    private _authService: AuthService,
    private _modalService: LayoutModalService,
    private _customerService: CustomerService,
    private _headerService: LayoutHeaderService,
    private _footerService: LayoutFooterService
  ) {
  }

  ngOnInit(): void {
    this._headerService.show();
    this._footerService.show();

    this.loginUser = this._authService.getLoginUser();
    this._route.data.pipe(takeWhile(() => this.isUnsubscribe === false)).subscribe(data => {
      this.customer = data?.customer;
      this._customerService.setSelectedCustomer(this.customer);
      this.existingInsuranceList = undefined;
      this.suggestInsuranceList = undefined;
      this.groupCustomerList = undefined;
      this.existingTotal = undefined;
      this.suggestTotal = undefined;

      this._requestCustomerInsuranceExisting();
      this._requestCustomerInsuranceSuggest();
      this._requestGroupCustomerList();

      if (this.customer.birth_day.length === 0) {
        this._alertCustomerRequireField();
      }
    });

    // this.onShowCustomerInfoModal();
    // this.onShowCaseHistoryModal();
    // this._showAddInsuranceModal();
    // this._showGroupCustomerModal();
    // this._confirmInsurance();
    // this._alertCustomerRequireField();
  }

  ngOnDestroy(): void {
    this.isUnsubscribe = true;
  }

  onGotoCustomer(groupCustomerItem) {
    this._router.navigateByUrl('customer/' + groupCustomerItem.customer);
  }

  onShowCustomerInfoModal() {
    this._modalService.create(CustomerInfoModalComponent, {
      customer: this.customer,
      dismiss:  () => this._modalService.dismiss()
    });
  }

  onShowCaseHistoryModal() {
    this._modalService.create(CaseHistoryModalComponent, {
      customer: this.customer,
      dismiss:  () => this._modalService.dismiss()
    });
  }

  onGotoAnalysis() {
    if (!(this.existingInsuranceList?.length > 0)) {
      this._toastService.alert('증권을 추가해 주세요.');
      return;
    }

    this._router.navigateByUrl('/customer/' + this.customer.id + '/analysis');
  }

  onGotoCompare() {
    if (!(this.suggestInsuranceList?.length > 0)) {
      this._toastService.alert('증권을 추가해 주세요.');
      return;
    }

    this._router.navigateByUrl('/customer/' + this.customer.id + '/compare');
  }

  onAddGroupCustomer() {
    if (this.customer?.group_customers?.length === 0 && this.customer?.parent_customer) {
      this._modalService.create(AlertModalComponent, {
        width: '400px',
        title: '그룹이있습니다.',
        body: `이미 ${this.customer.parent_customer.name}님 그룹으로 묶여있는 고객입니다.<br/>새로운 그룹을 만드시겠습니까?`,
        btnCancelName: '취소',
        btnConfirmName: '만들기',
        isConfirm: true,
        dismiss: () => {
          this._modalService.dismiss();
        },
        confirm: () => {
          this._modalService.dismiss();
          this._showAddGroupCustomerModal();
        }
      });

      return;
    }

    this._showAddGroupCustomerModal();
  }

  onEditGroupCustomer() {
    this._modalService.create(GroupCustomerModalComponent, {
      customer: this.customer,
      type: 'edit',
      groupCustomerList: this.groupCustomerList,
      dismiss:  () => {
        this._modalService.dismiss();
      },
      complete:  (customer) => {
        this.customer = customer;
        this._requestGroupCustomerList();
        this._modalService.dismiss();
      }
    });
  }


  onAddInsurance(portfolioType: number) {
    this._confirmInsurance(portfolioType);
  }

  onDeleteCustomer() {
    this._modalService.create(AlertModalComponent, {
      title:     '삭제하기',
      body:      '정말 삭제 하시겠어요?',
      isConfirm: true,
      dismiss:   () => this._modalService.dismiss(),
      cancel:    () => this._modalService.dismiss(),
      confirm:   () => {
        this._requestDeleteCustomer();
        this._modalService.dismiss();
      }
    });
  }

  onClickCustomer(id) {
    if (this['isShare']) {
      return;
    }

    this._router.navigateByUrl(`customer/${id}`);
  }

  onGotoCustomerList() {
    if (this['isShare']) {
      return;
    }

    this._router.navigateByUrl('customer');
  }

  /******************************     request functions     ****************************/

  private _showAddInsuranceModal(portfolioType: number): void {
    this._modalService.create(AddCustomerInsuranceModalComponent, {
      customer: this.customer,
      portfolioType,
      dismiss:  () => {
        this._modalService.dismiss();
      },
      complete:  () => {
        this._requestCustomerInsuranceExisting();
        this._requestCustomerInsuranceSuggest();
        this._modalService.dismiss();
      }
    });
  }

  private _showAddGroupCustomerModal(): void {
    this._modalService.create(GroupCustomerModalComponent, {
      customer: this.customer,
      type: 'add',
      groupCustomerList: this.groupCustomerList,
      dismiss:  () => {
        this._modalService.dismiss();
      },
      complete:  (customer) => {
        this.customer = customer;
        this._requestGroupCustomerList();
        this._modalService.dismiss();
      }
    });
  }

  private _confirmInsurance(portfolioType: number): void {
    if (portfolioType === 1) {
      this._router.navigateByUrl(`insurance/create?portfolioType=${portfolioType}`);
      return;
    }

    this._modalService.create(AlertModalComponent, {
      width:          '338px',
      title:          '증권 추가',
      body:           '제안 포트폴리오 추가 방법을<br/>선택해 주세요.',
      btnCancelName:  '새로 입력',
      btnConfirmName: '불러오기',
      isConfirm:      true,
      dismiss:        () => {
        this._modalService.dismiss();
      },
      cancel:         () => {
        this._router.navigateByUrl(`template/create`);
        this._modalService.dismiss();
      },
      confirm:        () => {
        this._modalService.dismiss();
        this._showAddInsuranceModal(portfolioType);
      }
    });
  }

  private _alertCustomerRequireField(): void {
    this._modalService.create(AlertModalComponent, {
      width:          '338px',
      title:          '필수사항 입력',
      body:           '고객정보에서 생년월일을<br/>먼저 입력해 주세요.',
      btnCancelName:  '취소',
      btnConfirmName: '바로 입력하기',
      isConfirm:      true,
      dismiss:        () => {
        this._modalService.dismiss();
      },
      cancel:         () => {
        this._modalService.dismiss();
      },
      confirm:        () => {
        this._modalService.dismiss();
        this.onShowCustomerInfoModal();
      }
    });
  }

  private _requestCustomerInsuranceExisting() {
    if (this.SCustomerInsuranceExistingRequest) { // 연속 처리 방지
      return;
    }

    const url                              = ApiUrl.getCustomerInsuranceList.replace(':id', this.customer.id.toString());
    const params                           = {
      portfolio_type: 1
    };
    this.SCustomerInsuranceExistingRequest = this._apiService.get({
      url,
      params
    }).subscribe(res => {
      console.log('requestCustomerInsuranceExisting res => ', res);
      this.existingInsuranceList             = res.results;
      this.existingTotal = this.existingInsuranceList.reduce((a, b) => a + b.monthly_premiums, 0)
      this.SCustomerInsuranceExistingRequest = null;
    }, error => {
      console.log('requestCustomerInsuranceExisting error =>', error);
      this.SCustomerInsuranceExistingRequest = null;
    });
  }

  private _requestCustomerInsuranceSuggest() {
    if (this.SCustomerInsuranceSuggestRequest) { // 연속 처리 방지
      return;
    }

    const url                             = ApiUrl.getCustomerInsuranceList.replace(':id', this.customer.id.toString());
    const params                          = {
      portfolio_type: 2
    };
    this.SCustomerInsuranceSuggestRequest = this._apiService.get({
      url,
      params
    }).subscribe(res => {
      console.log('requestCustomerInsuranceSuggest res => ', res);
      this.suggestInsuranceList = res.results;
      this.suggestTotal = this.suggestInsuranceList.reduce((a, b) => a + b.monthly_premiums, 0)

      this.SCustomerInsuranceSuggestRequest = null;
    }, error => {
      console.log('requestCustomerInsuranceSuggest error =>', error);
      this.SCustomerInsuranceSuggestRequest = null;
    });
  }

  private _requestDeleteCustomer() {
    if (this.SDeleteCustomerRequest) { // 연속 처리 방지
      return;
    }

    const url                   = ApiUrl.deleteCustomer.replace(':id', this.customer.id.toString());
    this.SDeleteCustomerRequest = this._apiService.delete({
      url
    }).subscribe(res => {
      console.log('requestDeleteCustomer res => ', res);
      this._toastService.alert('삭제 되었습니다.');
      history.back();
      this.SDeleteCustomerRequest = null;
    }, error => {
      console.log('requestDeleteCustomer error =>', error);
      this.SDeleteCustomerRequest = null;
    });
  }

  private _requestGroupCustomerList() {
    if (this.SGroupCustomerListRequest) { // 연속 처리 방지
      return;
    }

    const url                      = ApiUrl.getGroupCustomerList.replace(':id', this.customer.id);
    this.SGroupCustomerListRequest = this._apiService.get({
      url
    }).subscribe(res => {
      console.log('requestGroupCustomerList res => ', res);
      this.groupCustomerList         = res;
      this.SGroupCustomerListRequest = null;
    }, error => {
      console.log('requestGroupCustomerList error =>', error);
      this.SGroupCustomerListRequest = null;
    });
  }

  onCopyUrl() {
    GlobalBlurHandler.blur();
    this._clipboard.copy(location.href);
    this._toastService.alert('링크가 복사 되었습니다.');
  }

  onBack() {
    window.history.back();
  }

  onGotoForm(insuranceItem) {
    if (insuranceItem.is_template) {
      this._router.navigateByUrl('template/edit/'+insuranceItem.id);
    } else {
      this._router.navigateByUrl('insurance/'+insuranceItem.id);
    }
  }
}


