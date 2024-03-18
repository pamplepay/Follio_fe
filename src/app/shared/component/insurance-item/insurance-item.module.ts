import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsuranceItemComponent } from './insurance-item.component';
import { RouterModule } from '@angular/router';
import { AutosizeModule } from 'ngx-autosize';


@NgModule({
  declarations: [
    InsuranceItemComponent
  ],
  exports:      [
    InsuranceItemComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AutosizeModule
  ]
})
export class InsuranceItemModule {
}
