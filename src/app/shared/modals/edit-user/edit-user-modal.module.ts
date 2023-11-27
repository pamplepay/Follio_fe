import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditUserModalComponent } from './edit-user-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FocusModule } from '../../../core/module/focus/focus.module';

@NgModule({
  declarations: [ EditUserModalComponent ],
  imports:      [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FocusModule,
  ]
})
export class EditUserModalModule {
}
