import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupCustomerModalComponent } from './group-customer-modal.component';
import { FocusModule } from '../../../core/module/focus/focus.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    GroupCustomerModalComponent
  ],
  exports: [
    GroupCustomerModalComponent
  ],
  imports: [
    CommonModule,
    FocusModule,
    ReactiveFormsModule,
  ]
})
export class GroupCustomerModalModule { }
