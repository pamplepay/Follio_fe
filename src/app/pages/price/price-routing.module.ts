import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PriceComponent } from './price.component';
import { MembershipListResolver } from '../../shared/resolver/membership-list.resolver';

const routes: Routes = [{
  path: '',
  component: PriceComponent,
  resolve: {
    membershipList: MembershipListResolver
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceRoutingModule { }
