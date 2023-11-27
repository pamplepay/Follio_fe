import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';

@Component({
  selector:    'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls:   [ './line-chart.component.scss' ]
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() width: number = 100;
  @Input() height: number = 100;
  @Input() data: number[];
  public lineChartData: ChartDataSets[]                         = [
    {
      data: [
        200,
        600,
        800,
        1300,
        2000,
        3000
      ]
    },
  ];
  public lineChartLabels: Label[]                               = [
    '지금',
    '10년 후',
    '20년 후',
    '30년 후',
    '40년 후',
    '50년 후'
  ];
  public lineChartOptions: (ChartOptions & { annotation?: any });
  public lineChartColors: Color[]                               = [
    { // grey
      backgroundColor:           'rgba(255, 96, 182, 0.2)',
      borderColor:               '#FF60B6',
      borderWidth:     2,
      pointRadius:     0
    },
    { // dark grey
      backgroundColor:           'rgba(32, 217, 229, 0.2)',
      borderColor:               '#1FD9E5',
      borderWidth:     2,
      pointRadius:     0
    },
  ];
  public lineChartLegend                                        = true;
  public lineChartType: ChartType                               = 'line';
  // public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor() {
  }

  ngOnInit(): void {
    this.lineChartOptions = {
      responsive: true,
      scales:     {
        // We use this empty structure as a placeholder for dynamic theming.
        xAxes: [{
          gridLines: {
            display: false,
          }
        }],
        yAxes: [{
          gridLines: {
            borderDash: [5],
          },
          ticks: {
            maxTicksLimit: 5,
            min: this.data[0],
            callback: (value, index, values) => {
              value = value.toLocaleString();
              return value;
            }
          }
        }],
        gridLines: {
          borderDash: [ 10 ]
        }
      },
      legend:     {
        display: false
      }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.lineChartData[0].data = this.data;
  }



  public randomize(): void {
    for (let i = 0; i < this.lineChartData.length; i++) {
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        this.lineChartData[i].data[j] = this.generateNumber(i);
      }
    }
    this.chart.update();
  }

  private generateNumber(i: number): number {
    return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  }

  // events
  public chartClicked({ event, active }: { event?: MouseEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public hideOne(): void {
    const isHidden = this.chart.isDatasetHidden(1);
    this.chart.hideDataset(1, !isHidden);
  }

  public pushOne(): void {
    this.lineChartData.forEach((x, i) => {
      const num            = this.generateNumber(i);
      const data: number[] = x.data as number[];
      data.push(num);
    });
    this.lineChartLabels.push(`Label ${ this.lineChartLabels.length }`);
  }

  public changeColor(): void {
    this.lineChartColors[2].borderColor     = 'green';
    this.lineChartColors[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;
  }

  public changeLabel(): void {
    this.lineChartLabels[2] = [
      '1st Line',
      '2nd Line'
    ];
  }
}
