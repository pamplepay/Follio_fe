import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsuranceRoutingModule } from './insurance-routing.module';
import { InsuranceComponent } from './insurance.component';


@NgModule({
  declarations: [
    InsuranceComponent
  ],
  imports: [
    CommonModule,
    InsuranceRoutingModule
  ]
})
export class InsuranceModule { }
