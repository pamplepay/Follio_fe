import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadImageModalComponent } from './upload-image-modal.component';
import { FocusModule } from '../../../core/module/focus/focus.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UploadImageModalComponent
  ],
  exports: [
    UploadImageModalComponent
  ],
  imports: [
    CommonModule,
    FocusModule,
    ReactiveFormsModule,
  ]
})
export class UploadImageModalModule { }
