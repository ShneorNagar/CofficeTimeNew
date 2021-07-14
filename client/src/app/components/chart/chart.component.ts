import {Component, Input, OnInit} from '@angular/core';
import {ChartService} from "./chart.service";
import {CupSummary} from "./chart.entity";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  chartYear: any;
  chartMonth: any;
  @Input() summaryNumbers;
  @Input() chartData;
  cupsSummary: CupSummary[];

  constructor(private chartService: ChartService) {
    this.chartService.init().then(() =>{
      this.cupsSummary = this.chartService.getCupsSummary();
      this.chartYear = this.chartService.chartYear;
      this.chartMonth = this.chartService.chartMonth;
    });
  }

  ngOnInit(): void {
  }

}
