import { NgModule, ModuleWithProviders } from '@angular/core';
import { CookieService } from './cookie.service';

@NgModule({
  providers: [CookieService]
})
export class CookieModule {
}
