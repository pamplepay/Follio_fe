import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { AuthGuard } from '../../core/service/guard/auth.guard';
import { LandingGuard } from '../landing/landing.guard';


const routes: Routes = [
  {
    path:        '',
    component:   MainComponent,
    resolve:     {}
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class MainRoutingModule {
}
