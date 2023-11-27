import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnFocusDirective } from './on-focus.directive';
import { ClickFocusDirective } from './click-focus.directive';



@NgModule({
  declarations: [
    OnFocusDirective,
    ClickFocusDirective
  ],
  exports: [
    ClickFocusDirective,
    OnFocusDirective
  ],
  imports:      [
    CommonModule
  ]
})
export class FocusModule { }
