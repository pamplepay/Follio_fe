import { NgModule } from '@angular/core';
import { SecurityTrustUrlPipe } from './securityTrustUrl.pipe';


@NgModule({
  declarations: [ SecurityTrustUrlPipe ],
  exports:      [ SecurityTrustUrlPipe ]
})
export class SecurityTrustUrlPipeModule {
}
