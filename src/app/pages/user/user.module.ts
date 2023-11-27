import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { AlertModalModule } from '../../shared/modals/alert/alert-modal.module';
import { ParsePhoneNumberModule } from '../../core/pipe/parse-phone-number/parse-phone-number.module';
import { MomentModule } from 'ngx-moment';
import { RecommendCodeModalModule } from '../../shared/modals/recommend-code-modal/recommend-code-modal.module';


@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    AlertModalModule,
    UserRoutingModule,
    ParsePhoneNumberModule,
    MomentModule,
    RecommendCodeModalModule
  ]
})
export class UserModule { }
