import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecommendCodeModalComponent } from './recommend-code-modal.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    RecommendCodeModalComponent
  ],
  exports: [
    RecommendCodeModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class RecommendCodeModalModule { }
