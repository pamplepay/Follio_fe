import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector:    'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls:   [ './radar-chart.component.scss' ]
})
export class RadarChartComponent implements OnInit {
  @Input() width = 100;
  @Input() height = 100;
  @Input() fontColors: any[];
  @Input() name: any[];
  @Input() data1: any[];
  @Input() data2: any[];
  // Radar
  public radarChartOptions: RadialChartOptions = {
    responsive: true,
    scale:      {
      pointLabels: {
        fontSize: 12,
      },
      animate:     false,
      ticks:       {
        fontSize:          12,
        showLabelBackdrop: false,
        labelOffset:       10,
        stepSize:          25,
        min:               0,
        fontColor:         'rgba(20, 50, 67, 0.2)'
      },
      angleLines:  {
        display: false
      },
      gridLines:   {
        borderDash: [ 10 ]
      }
    },
    legend:     {
      display: false
    }
  };
  public radarChartLabels: Label[];
  public radarChartData: ChartDataSets[];
  public radarChartType: ChartType       = 'radar';

  constructor() {
  }

  ngOnInit(): void {
    this.radarChartLabels = this.name;
    this.radarChartData = []

    this.radarChartOptions.scale.pointLabels.fontColor = this.fontColors;

    if (this.data1) {
      this.radarChartData.push({
        data: this.data1,
        backgroundColor: 'rgba(32, 217, 229, 0.2)',
        borderColor:     '#1FD9E5',
        borderWidth:     3,
        pointRadius:     0
      })
    }

    if (this.data2) {
      this.radarChartData.push({
        data: this.data2,
        pointRadius:     0,
        backgroundColor: 'rgba(255, 96, 182, 0.2)',
        borderColor:     '#FF60B6',
        borderWidth:     3
      })
    }

    this.radarChartData.push({
      data:            Array(this.data1.length).fill(100),
      pointRadius:     0,
      backgroundColor: 'rgba(255, 96, 182, 0)',
      borderColor:     '#E7EBEC',
      borderDash:      [ 0 ],
      borderWidth:     2
    });
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

}
