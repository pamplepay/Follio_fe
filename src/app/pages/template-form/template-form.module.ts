import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplateFormRoutingModule } from './template-form-routing.module';
import { TemplateFormComponent } from './template-form.component';
import { FocusModule } from '../../core/module/focus/focus.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BtnTopModule } from '../../shared/component/btn-top/btn-top.module';
import { IMaskModule } from '../../core/module/imask';


@NgModule({
  declarations: [
    TemplateFormComponent
  ],
  imports: [
    CommonModule,
    TemplateFormRoutingModule,
    FocusModule,
    ReactiveFormsModule,
    BtnTopModule,
    IMaskModule
  ]
})
export class TemplateFormModule { }
