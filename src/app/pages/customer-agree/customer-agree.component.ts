import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/service/api/api.service';
import { Validator } from '../../core/validator/validator';
import { ApiUrl } from '../../core/constant/api.contant';

@Component({
  selector: 'app-customer-agree',
  templateUrl: './customer-agree.component.html',
  styleUrls: ['./customer-agree.component.scss']
})
export class CustomerAgreeComponent implements OnInit {
  // inputControl = new FormControl('', [Validators.required, Validator.num(), Validator.minLength(4)]);
  checkControl = new FormControl(false, [Validators.requiredTrue]);
  isShowValidLine: boolean = false;
  step: number = 1;
  private customerId: string;
  private SUpdateCustomerRequest: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.customerId = this._route.snapshot.params?.id;
  }

  onSubmit(): void {
    this.step = 2;
    this._requestUpdateCustomer();
    // this.isShowValidLine = true;
    // if (!this.inputControl.valid) {
    //   const error = document.querySelector('.form-input-wrap.error');
    //   error.scrollIntoView({
    //     block:    'center',
    //     behavior: 'smooth'
    //   });
    //   return;
    // }
  }

  private _requestUpdateCustomer() {
    if (this.SUpdateCustomerRequest) { // 연속 처리 방지
      return;
    }

    const url = ApiUrl.updateCustomer.replace(':id', this.customerId);
    const body = {
      is_agree_term: true,
    };
    this.SUpdateCustomerRequest = this._apiService.patch({
      url, body, isLoading: false
    }).subscribe(res => {
        console.log('requestUpdateCustomer res => ', res);
        this.SUpdateCustomerRequest = null;
      }, error => {
        console.log('requestUpdateCustomer error =>', error);
        this.SUpdateCustomerRequest = null;
      });
  }

}
