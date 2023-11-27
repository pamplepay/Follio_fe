import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutHeaderComponent } from './layout-header.component';
import { LayoutHeaderService } from './layout-header.service';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ConvertProdUrlModule } from '../../core/directive/convert-prod-url/convert-prod-url.module';

@NgModule({
  declarations: [ LayoutHeaderComponent ],
  exports:      [ LayoutHeaderComponent ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ConvertProdUrlModule
  ],
  providers:    [ LayoutHeaderService ]
})
export class LayoutHeaderModule {
}
