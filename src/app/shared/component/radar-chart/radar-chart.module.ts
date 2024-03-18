import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadarChartComponent } from './radar-chart.component';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    RadarChartComponent
  ],
  exports:      [
    RadarChartComponent
  ],
  imports:      [
    CommonModule,
    ChartsModule
  ]
})
export class RadarChartModule {
}
