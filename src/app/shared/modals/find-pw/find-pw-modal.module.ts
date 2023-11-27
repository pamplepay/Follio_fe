import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindPwModalComponent } from './find-pw-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [FindPwModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FindPwModalModule { }
