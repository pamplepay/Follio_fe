import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollToValueDirective } from './scroll-to-value.directive';


@NgModule({
  declarations: [ ScrollToValueDirective ],
  exports:      [
    ScrollToValueDirective,
  ],
  imports:      [
    CommonModule
  ]
})
export class ScrollToValueModule { }
