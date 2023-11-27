import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerIdComponent } from './customer-id.component';
import { CustomerResolver } from '../../shared/resolver/customer.resolver';

const routes: Routes = [{
  path: '',
  component: CustomerIdComponent,
  resolve: {
    customer: CustomerResolver
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerIdRoutingModule { }
