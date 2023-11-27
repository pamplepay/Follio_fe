import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerIdRoutingModule } from './customer-id-routing.module';
import { CustomerIdComponent } from './customer-id.component';
import { InsuranceItemModule } from '../../shared/component/insurance-item/insurance-item.module';
import { CaseHistoryModalModule } from '../../shared/modals/case-history/case-history-modal.module';
import { CustomerInfoModalModule } from '../../shared/modals/customer-info/customer-info-modal.module';
import { AddCustomerInsuranceModalModule } from '../../shared/modals/add-customer-insurance/add-customer-insurance-modal.module';
import { GroupCustomerModalModule } from '../../shared/modals/group-customer/group-customer-modal.module';


@NgModule({
  declarations: [
    CustomerIdComponent
  ],
  imports: [
    CommonModule,
    CustomerIdRoutingModule,
    InsuranceItemModule,
    CaseHistoryModalModule,
    CustomerInfoModalModule,
    AddCustomerInsuranceModalModule,
    GroupCustomerModalModule
  ]
})
export class CustomerIdModule { }
