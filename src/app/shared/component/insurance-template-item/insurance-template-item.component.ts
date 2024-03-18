import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '../../../core/service/common/common.service';
import { ICommonInsurance } from '../../../core/model/common.model';
import { CustomerService } from '../../../core/service/customer/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insurance-template-item',
  templateUrl: './insurance-template-item.component.html',
  styleUrls: ['./insurance-template-item.component.scss']
})
export class InsuranceTemplateItemComponent implements OnInit {
  @Input() insuranceTemplateItem: any;
  commonInsurance: ICommonInsurance;

  constructor(
    private _commonService: CommonService,
    private _customerService: CustomerService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this._commonService.rxInsurance().subscribe(commonInsurance => {
      this.commonInsurance = commonInsurance;
    })
  }

  onClickTemplate() {
    this._customerService.setSelectedCustomer(null);
    this._router.navigateByUrl(`/template/edit/${this.insuranceTemplateItem.id}?isTemplate=true`);
  }
}
