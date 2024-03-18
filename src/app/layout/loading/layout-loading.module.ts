import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutLoadingComponent } from './layout-loading.component';

@NgModule({
  imports:      [
    CommonModule,
  ],
  declarations: [LayoutLoadingComponent],
  exports:      [LayoutLoadingComponent]
})
export class LayoutLoadingModule {
}
