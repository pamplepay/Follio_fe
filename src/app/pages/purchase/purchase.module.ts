import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchaseComponent } from './purchase.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PurchaseComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    ReactiveFormsModule
  ]
})
export class PurchaseModule { }
