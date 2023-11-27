import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutFooterComponent } from './layout-footer.component';
import { LayoutFooterService } from './layout-footer.service';
import { RouterModule } from '@angular/router';
import { FocusModule } from '../../core/module/focus/focus.module';


@NgModule({
  declarations: [ LayoutFooterComponent ],
  imports: [
    CommonModule,
    RouterModule,
    FocusModule
  ],
  exports:      [
    LayoutFooterComponent
  ],
  providers:    [ LayoutFooterService ]
})
export class LayoutFooterModule {
}
