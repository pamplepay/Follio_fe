import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDefaultImageDirective } from './event-default-image.directive';



@NgModule({
  declarations: [EventDefaultImageDirective],
  imports: [
    CommonModule
  ],
  exports: [
    EventDefaultImageDirective
  ]
})
export class EventDefaultImageModule { }
