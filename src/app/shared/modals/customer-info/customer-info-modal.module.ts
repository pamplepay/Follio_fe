import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerInfoModalComponent } from './customer-info-modal.component';
import { FocusModule } from '../../../core/module/focus/focus.module';
import { ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from '../../../core/module/imask';



@NgModule({
  declarations: [
    CustomerInfoModalComponent
  ],
  exports: [
    CustomerInfoModalComponent
  ],
  imports: [
    CommonModule,
    FocusModule,
    ReactiveFormsModule,
    IMaskModule
  ],
})
export class CustomerInfoModalModule { }
