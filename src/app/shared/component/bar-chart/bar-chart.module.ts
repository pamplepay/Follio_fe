import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { BarChartComponent } from './bar-chart.component';



@NgModule({
  declarations: [
    BarChartComponent
  ],
  exports: [
    BarChartComponent
  ],
  imports: [
    CommonModule,
    ChartsModule
  ]
})
export class BarChartModule { }
