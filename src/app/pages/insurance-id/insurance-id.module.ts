import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsuranceIdRoutingModule } from './insurance-id-routing.module';
import { InsuranceIdComponent } from './insurance-id.component';
import { FocusModule } from '../../core/module/focus/focus.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from '../../core/module/imask';
import { BtnTopModule } from '../../shared/component/btn-top/btn-top.module';
import { AutosizeModule } from 'ngx-autosize';


@NgModule({
  declarations: [
    InsuranceIdComponent
  ],
  imports: [
    CommonModule,
    InsuranceIdRoutingModule,
    FocusModule,
    FormsModule,
    ReactiveFormsModule,
    IMaskModule,
    BtnTopModule,
    AutosizeModule
  ]
})
export class InsuranceIdModule { }
