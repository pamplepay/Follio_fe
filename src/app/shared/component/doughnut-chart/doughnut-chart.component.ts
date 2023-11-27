import { Component, Input, OnInit } from '@angular/core';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector:    'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls:   [ './doughnut-chart.component.scss' ]
})
export class DoughnutChartComponent implements OnInit {
  @Input() width = 100;
  @Input() height = 100;
  @Input() data = [];
  // Doughnut
  public doughnutChartDataSet: ChartDataSets[];
  public doughnutChartType: ChartType    = 'doughnut';
  colors: any                            = [
    {
      backgroundColor:           ['#1FD9E5', '#FF60B6', '#133243'],
      borderWidth: 0
    }
  ];
  chartOptions: ChartOptions = {
    cutoutPercentage: 28,
    tooltips: {
      enabled: false,
    },
    hover: {
      mode: null
    }
  };

  constructor() {
  }

  ngOnInit(): void {
    this.doughnutChartDataSet = [{
      data: this.data
    }];

  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
}
