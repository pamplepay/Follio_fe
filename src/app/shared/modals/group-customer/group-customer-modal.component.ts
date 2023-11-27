import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../core/service/api/api.service';
import { ApiUrl } from '../../../core/constant/api.contant';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector:    'app-customer-info-modal',
  templateUrl: './group-customer-modal.component.html',
  styleUrls:   [ './group-customer-modal.component.scss' ]
})
export class GroupCustomerModalComponent implements OnInit {
  @Input() customer: any;
  @Input() type: 'add' | 'edit';
  @Input() groupCustomerList: any[];
  @Output() dismiss              = new EventEmitter();
  @Output() complete             = new EventEmitter();
  searchFormControl: FormControl = new FormControl('');
  customerList: any[];
  totalCount: number;
  groupCustomerIdList: number[];

  private SCustomerListRequest: Subscription | undefined;
  private SUpdateGroupCustomerRequest: Subscription | undefined;
  private selectedCustomerItem: any;

  constructor(
    private _apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    console.log('groupCustomerList', this.groupCustomerList);
    this.groupCustomerIdList = this.groupCustomerList.map(item => item.customer);

    if (this.type === 'add') {
      this._requestCustomerList(1);
    } else {
      this.customerList = this.groupCustomerList;
      this.customerList.forEach(item => {
        item.checked = true;
      });
    }
    this.searchFormControl.valueChanges.pipe(debounceTime(300)).subscribe(keyword => {
      this._requestCustomerList(1, keyword);
    });
  }

  onClose() {
    this.dismiss.emit();
  }

  onSelectCustomer(customerItem) {
    // this.selectedCustomerItem = customerItem;
    customerItem.checked = !customerItem?.checked;
  }

  onSubmit() {
    this._requestUpdateGroupCustomer();
  }

  private _requestUpdateGroupCustomer() {
    if (this.SUpdateGroupCustomerRequest) { // 연속 처리 방지
      return;
    }


    let customerList = this.customerList.filter(item => item?.checked).map(item => item.customer || item.id);
    const url          = ApiUrl.updateGroupCustomer.replace(':id', this.customer.id);
    if (this.type === 'add') {
      customerList = this.groupCustomerIdList.concat(customerList)
    }
    const body                       = {
      group_customers: customerList
    };
    this.SUpdateGroupCustomerRequest = this._apiService.post({
      url,
      body
    }).subscribe(res => {
      console.log('requestUpdateGroupCustomer res => ', res);
      this.customer = res;
      this.complete.emit(this.customer);
      this.SUpdateGroupCustomerRequest = null;
    }, error => {
      console.log('requestUpdateGroupCustomer error =>', error);
      this.SUpdateGroupCustomerRequest = null;
    });
  }

  private _requestCustomerList(page, keyword?: string) {
    if (this.SCustomerListRequest) { // 연속 처리 방지
      return;
    }

    const url    = ApiUrl.getCustomerList;
    const params = {
      page
    };

    if (keyword) {
      params['keyword'] = keyword;
    }

    this.SCustomerListRequest = this._apiService.get({
      url,
      params
    }).subscribe(res => {
      console.log('requestCustomerList res => ', res);
      this.customerList = res.results.filter(item => {
        const isThisCustomer = item.id === this.customer.id;
        const isParentCustomer = item.id === this.customer.parent_customer?.id;
        const isGroupCustomer = this.groupCustomerIdList.indexOf(item.id) !== -1;
        return !(isThisCustomer || isParentCustomer || isGroupCustomer)
      });
      this.customerList.forEach(item => {
        item.checked = this.customer.group_customers.indexOf(item.id) !== -1;
      });
      this.totalCount           = res.count;
      this.SCustomerListRequest = null;
    }, error => {
      console.log('requestCustomerList error =>', error);
      this.SCustomerListRequest = null;
    });
  }
}
