import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgSrcsetDirective } from './img-srcset.directive';



@NgModule({
  declarations: [ImgSrcsetDirective],
  imports: [
    CommonModule
  ],
  exports: [
    ImgSrcsetDirective
  ]
})
export class ImgSrcsetModule { }
