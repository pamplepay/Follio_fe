import { Component, OnInit } from '@angular/core';
import { LayoutHeaderService } from '../../layout/header/layout-header.service';
import { LayoutFooterService } from '../../layout/footer/layout-footer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Validator } from '../../core/validator/validator';
import { LayoutToastService } from '../../layout/toast/layout-toast.service';
import { Subscription } from 'rxjs';
import { ApiService } from '../../core/service/api/api.service';
import { ApiUrl } from '../../core/constant/api.contant';
import { IUser } from '../../core/model/auth.model';
import { AuthService } from '../../core/service/auth/auth.service';

@Component({
  selector:    'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls:   [ './purchase.component.scss' ]
})
export class PurchaseComponent implements OnInit {
  form: FormGroup;
  membership: any;
  loginUser:IUser;
  isDone: boolean = false;
  isShowValidLine: boolean = false;

  private SCreateMembershipPaymentRequest: Subscription | undefined;

  constructor(
    private _headerService: LayoutHeaderService,
    private _footerService: LayoutFooterService,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _apiService: ApiService,
    private _authService: AuthService,
    private _toastService: LayoutToastService,
  ) {
  }

  ngOnInit(): void {
    this._headerService.show();
    this._footerService.show();
    this.loginUser = this._authService.getLoginUser();
    this.membership = this._route.snapshot.data.membership;
    this.form       = this._formBuilder.group({
      'payment_username': [
        '',
        [
          Validators.required,
          Validator.kor()
        ]
      ],
      'phone_number':     '',
      term:               [
        false,
        Validators.requiredTrue
      ]
    });
  }

  onSubmit(): void {
    this.isShowValidLine = true;

    if (!this.form.get('payment_username').valid) {
      return;
    }

    if (!this.form.get('term').valid) {
      this._toastService.alert('약관에 동의해 주세요.');
      return;
    }

    const { payment_username, phone_number } = this.form.value;

    this._requestCreateMembershipPayment(payment_username, phone_number);
  }

  onClickTerm($event: any) {
    $event.stopPropagation();
    const isAgreeTerm = this.form.get('term').value;
    console.log('isAgreeTerm', isAgreeTerm);
    this.form.get('term').setValue(!isAgreeTerm);
    console.log('this.form.get(\'term\')', this.form.get('term').value);
  }

  private _requestCreateMembershipPayment(payment_username: string, phone_number: string) {
    if (this.SCreateMembershipPaymentRequest) { // 연속 처리 방지
      return;
    }

    const url = ApiUrl.payment;
    const body = {
      user: this.loginUser.id,
      membership: this.membership.id,
      amount: this.membership.amount,
      payment_method: 1
    }
    console.log('body', body);
    if (payment_username) {
      body['payment_username'] = payment_username
    }

    if (phone_number) {
      body['phone_number'] = phone_number
    }

    this.SCreateMembershipPaymentRequest = this._apiService.post({
      url, body
    }).subscribe(res => {
        console.log('requestCreateMembershipPayment res => ', res);
        this.isDone = true;
        this.SCreateMembershipPaymentRequest = null;
      }, error => {
        console.log('requestCreateMembershipPayment error =>', error);
        this.SCreateMembershipPaymentRequest = null;
      });
  }

  onClickMoreTerm() {
    window.open('https://pharmplus.notion.site/2843c44d0a414336b6ac5bc6b3e38796', '_blank');
  }
}
