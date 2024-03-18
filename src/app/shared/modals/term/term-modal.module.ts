import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermModalComponent } from './term-modal.component';



@NgModule({
  declarations: [
    TermModalComponent
  ],
  exports: [
    TermModalComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TermModalModule { }
