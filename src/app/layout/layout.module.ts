import { NgModule } from '@angular/core';
import { LayoutModalModule } from './modal/layout-modal.module';
import { LayoutToastModule } from './toast/layout-toast.module';
import { LayoutLoadingModule } from './loading/layout-loading.module';
import { LayoutHeaderModule } from './header/layout-header.module';
import { LayoutFooterModule } from './footer/layout-footer.module';

@NgModule({
  imports: [
    LayoutModalModule,
    LayoutToastModule,
    LayoutLoadingModule,
    LayoutHeaderModule,
    LayoutFooterModule
  ],
  exports: [
    LayoutModalModule,
    LayoutToastModule,
    LayoutLoadingModule,
    LayoutHeaderModule,
    LayoutFooterModule
  ]
})
export class LayoutModule { }
