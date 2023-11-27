import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerCreateComponent } from './customer-create.component';
import { CustomerCreateRoutingModule } from './customer-create-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from '../../core/module/imask';



@NgModule({
  declarations: [
    CustomerCreateComponent
  ],
  imports: [
    CommonModule,
    CustomerCreateRoutingModule,
    ReactiveFormsModule,
    IMaskModule
  ]
})
export class CustomerCreateModule { }
