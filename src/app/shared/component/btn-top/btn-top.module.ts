import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnTopComponent } from './btn-top.component';



@NgModule({
  declarations: [
    BtnTopComponent
  ],
  exports: [
    BtnTopComponent
  ],
  imports: [
    CommonModule
  ]
})
export class BtnTopModule { }
