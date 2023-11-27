import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModalComponent } from './layout-modal.component';



@NgModule({
  declarations: [LayoutModalComponent],
  exports: [LayoutModalComponent],
  imports: [
    CommonModule
  ]
})
export class LayoutModalModule { }
