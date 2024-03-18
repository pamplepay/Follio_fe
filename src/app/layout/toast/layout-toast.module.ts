import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutToastComponent } from './layout-toast.component';
import { LayoutToastService } from './layout-toast.service';
import { BasicToastModule } from './basic-toast/basic-toast.module';


@NgModule({
  declarations: [LayoutToastComponent],
  exports: [LayoutToastComponent],
  imports: [
    CommonModule,
    BasicToastModule
  ],
  providers: [
    LayoutToastService
  ]
})
export class LayoutToastModule { }
