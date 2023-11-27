import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsuranceTemplateItemComponent } from './insurance-template-item.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    InsuranceTemplateItemComponent
  ],
  exports:      [
    InsuranceTemplateItemComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class InsuranceTemplateItemModule {
}
