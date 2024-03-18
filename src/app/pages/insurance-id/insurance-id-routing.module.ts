import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsuranceIdComponent } from './insurance-id.component';
import { CommonInsuranceGuard } from '../../core/service/guard/common-insurance.guard';
import { CustomerInsuranceResolver } from '../../shared/resolver/customer-insurance.resolver';

const routes: Routes = [{
  path: '',
  component: InsuranceIdComponent,
  canActivate: [
    CommonInsuranceGuard
  ],
  resolve: {
    customerInsurance: CustomerInsuranceResolver
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceIdRoutingModule { }
