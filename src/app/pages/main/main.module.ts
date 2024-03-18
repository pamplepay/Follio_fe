import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { InsuranceTemplateItemModule } from '../../shared/component/insurance-template-item/insurance-template-item.module';
import { InsuranceItemModule } from '../../shared/component/insurance-item/insurance-item.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ MainComponent ],
  imports: [
    CommonModule,
    MainRoutingModule,
    InsuranceTemplateItemModule,
    InsuranceItemModule,
    ReactiveFormsModule
  ]
})
export class MainModule {
}
