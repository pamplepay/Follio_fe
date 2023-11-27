import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplateRoutingModule } from './template-routing.module';
import { TemplateComponent } from './template.component';
import { InsuranceTemplateItemModule } from '../../shared/component/insurance-template-item/insurance-template-item.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TemplateComponent
  ],
  imports: [
    CommonModule,
    TemplateRoutingModule,
    InsuranceTemplateItemModule,
    ReactiveFormsModule
  ]
})
export class TemplateModule { }
