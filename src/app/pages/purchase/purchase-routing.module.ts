import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseComponent } from './purchase.component';
import { MembershipResolver } from '../../shared/resolver/membership.resolver';

const routes: Routes = [{
  path: '',
  component: PurchaseComponent,
  resolve: {
    membership: MembershipResolver
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
