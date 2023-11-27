import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerCompareComponent } from './customer-compare.component';

const routes: Routes = [
  {
    path:      '',
    component: CustomerCompareComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CustomerCompareRoutingModule {
}
