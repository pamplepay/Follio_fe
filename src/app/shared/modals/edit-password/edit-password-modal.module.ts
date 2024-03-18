import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditPasswordModalComponent } from './edit-password-modal.component';


@NgModule({
  declarations: [ EditPasswordModalComponent ],
  imports:      [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditPasswordModalModule {
}
