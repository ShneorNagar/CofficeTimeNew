import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartData} from "../chart.entity";

@Component({
  selector: 'app-chart-unit',
  templateUrl: './chart-unit.component.html',
  styleUrls: ['./chart-unit.component.css']
})
export class ChartUnitComponent implements OnInit, OnChanges {

  // working only at first time
  @Input() charts: ChartData[];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

}
