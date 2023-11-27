import { NgModule } from '@angular/core';
import { FindPwModalModule } from './find-pw/find-pw-modal.module';
import { CheckEmailModalModule } from './check-email/check-email-modal.module';
import { EditPasswordModalModule } from './edit-password/edit-password-modal.module';
import { EditUserModalModule } from './edit-user/edit-user-modal.module';

@NgModule({
  imports: [
    FindPwModalModule,
    CheckEmailModalModule,
    EditPasswordModalModule,
    EditUserModalModule,
  ]
})
export class ModalsModule {
}
