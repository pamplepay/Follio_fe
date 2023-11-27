import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateFormComponent } from './template-form.component';
import { CommonInsuranceGuard } from '../../core/service/guard/common-insurance.guard';

const routes: Routes = [
  {
    path:      '',
    component: TemplateFormComponent,
    canActivate: [
      CommonInsuranceGuard
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class TemplateFormRoutingModule {
}
