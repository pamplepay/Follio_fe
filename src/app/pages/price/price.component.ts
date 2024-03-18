import { Component, OnInit } from '@angular/core';
import { LayoutModalService } from '../../layout/modal/layout-modal.service';
import { AlertModalComponent } from '../../shared/modals/alert/alert-modal.component';
import { LayoutHeaderService } from '../../layout/header/layout-header.service';
import { AuthService } from '../../core/service/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutFooterService } from '../../layout/footer/layout-footer.service';
import { LayoutToastService } from '../../layout/toast/layout-toast.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { IUser } from '../../core/model/auth.model';
import { ApiUrl } from '../../core/constant/api.contant';
import { ApiService } from '../../core/service/api/api.service';

@Component({
  selector:    'app-price',
  templateUrl: './price.component.html',
  styleUrls:   [ './price.component.scss' ]
})
export class PriceComponent implements OnInit {
  membershipList: any[];
  loginUser: IUser;
  private SCreateMembershipPaymentRequest: any;

  constructor(
    private _headerService: LayoutHeaderService,
    private _modalService: LayoutModalService,
    private _authService: AuthService,
    private _router: Router,
    private _apiService: ApiService,
    private _route: ActivatedRoute,
    private _footerService: LayoutFooterService,
    private _toastService: LayoutToastService,
    private _clipboard: Clipboard
  ) {
  }

  ngOnInit(): void {
    this._headerService.show();
    this._footerService.show();
    this.loginUser = this._authService.getLoginUser();
    this.membershipList = this._route.snapshot.data.membershipList.results;
  }

  private _showAlert(): void {
    this._modalService.create(AlertModalComponent, {
      width:          '338px',
      title:          '로그인',
      body:           '로그인 후 구매하실 수 있어.<br/>로그인 하시겠어요?',
      btnCancelName:  '아니요',
      btnConfirmName: '네',
      isConfirm:      true,
      dismiss:        () => {
        this._modalService.dismiss();
      },
      confirm:        () => {
        this._modalService.dismiss();
      }
    });
  }

  onGotoMain() {
    if (!this._authService.checkLogin('main')) {
      return;
    }

    this._router.navigateByUrl('main');
  }

  onClickMembershipItem(membershipItem, membershipIndex) {
    if (!this._authService.checkLogin()) {
      return;
    }
    
    this._requestCreateMembershipPayment(membershipItem);
    if (membershipIndex === 0) {
      window.open('https://tally.so/r/wQJ5gn', '_blank');
    }
    if (membershipIndex === 1) {
      window.open('https://tally.so/r/w7VdL3', '_blank');
    }
    if (membershipIndex === 2) {
      window.open('https://tally.so/r/wb8lem', '_blank');
    }
  }

  onCopyMyCode(recommend_code) {
    if (!this._authService.checkLogin()) {
      return;
    }

    this._clipboard.copy(recommend_code);

    this._toastService.alert('추천코드가 복사 되었습니다.');
  }

  private _requestCreateMembershipPayment(membership) {
    if (this.SCreateMembershipPaymentRequest) { // 연속 처리 방지
      return;
    }

    const url = ApiUrl.payment;
    const body = {
      user: this.loginUser.id,
      membership: membership.id,
      amount: membership.amount,
      payment_method: 1,
      payment_username: this.loginUser.name
    }

    this.SCreateMembershipPaymentRequest = this._apiService.post({
      url, body
    }).subscribe(res => {
      console.log('requestCreateMembershipPayment res => ', res);
      this.SCreateMembershipPaymentRequest = null;
    }, error => {
      console.log('requestCreateMembershipPayment error =>', error);
      this.SCreateMembershipPaymentRequest = null;
    });
  }
}
