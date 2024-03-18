import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerAgreeRoutingModule } from './customer-agree-routing.module';
import { CustomerAgreeComponent } from './customer-agree.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CustomerAgreeComponent
  ],
  imports: [
    CommonModule,
    CustomerAgreeRoutingModule,
    ReactiveFormsModule
  ]
})
export class CustomerAgreeModule { }
