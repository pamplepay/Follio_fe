import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerAnalysisComponent } from './customer-analysis.component';
import { CustomerAnalysisRoutingModule } from './customer-analysis-routing.module';
import { BarChartModule } from '../../shared/component/bar-chart/bar-chart.module';
import { LineChartModule } from '../../shared/component/line-chart/line-chart.module';
import { DoughnutChartModule } from '../../shared/component/doughnut-chart/doughnut-chart.module';
import { RadarChartModule } from '../../shared/component/radar-chart/radar-chart.module';
import { BtnTopModule } from '../../shared/component/btn-top/btn-top.module';



@NgModule({
  declarations: [
    CustomerAnalysisComponent
  ],
  imports: [
    CommonModule,
    CustomerAnalysisRoutingModule,
    BarChartModule,
    LineChartModule,
    DoughnutChartModule,
    RadarChartModule,
    BtnTopModule
  ]
})
export class CustomerAnalysisModule { }
