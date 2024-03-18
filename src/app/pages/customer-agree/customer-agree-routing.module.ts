import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerAgreeComponent } from './customer-agree.component';
import { CustomerAgreeGuard } from './customer-agree.guard';

const routes: Routes = [
  {
    path:      '',
    component: CustomerAgreeComponent,
    canActivate: [
      CustomerAgreeGuard
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CustomerAgreeRoutingModule {
}
