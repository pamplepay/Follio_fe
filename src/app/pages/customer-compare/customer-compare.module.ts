import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerCompareComponent } from './customer-compare.component';
import { CustomerCompareRoutingModule } from './customer-compare-routing.module';
import { BarChartModule } from '../../shared/component/bar-chart/bar-chart.module';
import { LineChartModule } from '../../shared/component/line-chart/line-chart.module';
import { DoughnutChartModule } from '../../shared/component/doughnut-chart/doughnut-chart.module';
import { RadarChartModule } from '../../shared/component/radar-chart/radar-chart.module';
import { InsuranceItemModule } from '../../shared/component/insurance-item/insurance-item.module';
import { BtnTopModule } from '../../shared/component/btn-top/btn-top.module';
import { NgAbsPipeModule } from 'angular-pipes';



@NgModule({
  declarations: [
    CustomerCompareComponent
  ],
  imports: [
    CommonModule,
    CustomerCompareRoutingModule,
    BarChartModule,
    LineChartModule,
    DoughnutChartModule,
    RadarChartModule,
    InsuranceItemModule,
    BtnTopModule,
    NgAbsPipeModule
  ]
})
export class CustomerCompareModule { }
