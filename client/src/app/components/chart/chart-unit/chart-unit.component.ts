import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartData} from "../chart.entity";

@Component({
  selector: 'app-chart-unit',
  templateUrl: './chart-unit.component.html',
  styleUrls: ['./chart-unit.component.css']
})
export class ChartUnitComponent implements OnChanges {

  @Input() charts: ChartData[];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

}
