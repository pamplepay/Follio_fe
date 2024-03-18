import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModalComponent } from './alert-modal.component';



@NgModule({
  declarations: [
    AlertModalComponent
  ],
  exports: [
    AlertModalComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AlertModalModule { }
