import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvertProdUrlDirective } from './convert-prod-url.directive';



@NgModule({
  declarations: [ConvertProdUrlDirective],
  imports: [
    CommonModule
  ],
  exports: [
    ConvertProdUrlDirective
  ]
})
export class ConvertProdUrlModule { }
