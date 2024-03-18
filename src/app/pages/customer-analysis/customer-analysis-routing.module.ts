import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerAnalysisComponent } from './customer-analysis.component';

const routes: Routes = [
  {
    path:      '',
    component: CustomerAnalysisComponent,
    canActivate: [

    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CustomerAnalysisRoutingModule {
}
