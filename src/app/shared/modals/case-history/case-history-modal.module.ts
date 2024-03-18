import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseHistoryModalComponent } from './case-history-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from '../../../core/module/imask';


@NgModule({
  declarations: [
    CaseHistoryModalComponent
  ],
  exports: [
    CaseHistoryModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IMaskModule
  ]
})
export class CaseHistoryModalModule { }
