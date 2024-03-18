import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { IMaskModule } from '../../core/module/imask';
import { PaymentStatusPipe } from './payment.pipe';
import { MomentModule } from 'ngx-moment';


@NgModule({
  declarations: [
    PaymentComponent,
    PaymentStatusPipe
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    IMaskModule,
    MomentModule
  ]
})
export class PaymentModule { }
