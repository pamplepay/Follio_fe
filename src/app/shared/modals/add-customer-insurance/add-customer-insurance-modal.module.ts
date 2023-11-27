import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCustomerInsuranceModalComponent } from './add-customer-insurance-modal.component';
import { FocusModule } from '../../../core/module/focus/focus.module';
import { ReactiveFormsModule } from '@angular/forms';
import { InsuranceItemModule } from '../../component/insurance-item/insurance-item.module';



@NgModule({
  declarations: [
    AddCustomerInsuranceModalComponent
  ],
  exports: [
    AddCustomerInsuranceModalComponent
  ],
  imports: [
    CommonModule,
    FocusModule,
    ReactiveFormsModule,
    InsuranceItemModule
  ]
})
export class AddCustomerInsuranceModalModule { }
