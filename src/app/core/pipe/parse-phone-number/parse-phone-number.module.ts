import { NgModule } from '@angular/core';
import { ParsePhoneNumberPipe } from './parse-phone-number.pipe';


@NgModule({
  exports:      [ ParsePhoneNumberPipe ],
  declarations: [ ParsePhoneNumberPipe ]
})
export class ParsePhoneNumberModule {
}
