import {Component, OnInit} from '@angular/core';
import {ChartService} from "./chart.service";
import {ICupSummary, IChart, ChartData} from "./chart.entity";
import {ConfigService} from "../../services/config.service";
import {LocalUserService} from "../../services/local-storage/local-user.service";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit{

  chartYear: ChartData;
  chartMonth: ChartData;
  chartWeek: ChartData;
  charts: ChartData[] = [];
  cupsSummary: ICupSummary[];

  users: any[];
  usersNames: any;
  selectedUser: string;
  placeholder: any;

  constructor(private chartService: ChartService,
              private configService: ConfigService,
              private localUserService: LocalUserService) {}

  ngOnInit(): void {
    this.chartService.init().then(() => {
      this.cupsSummary = this.chartService.getCupsSummary();
      this.charts = this.chartService.getCharts();
    });

    this.configService.loadAllUsers(this.localUserService.getUser().user.userId)
      .then(res => {
        this.users = res.value;

        let usersNamesTmp = [];
        res.value.forEach(user => usersNamesTmp.push(user.username));
        this.usersNames = usersNamesTmp;
      });
  }

  addChartData() {
    const user = this.users.find(user => user.username === this.selectedUser);
    this.chartService.updateChartsByUserId(user.user_id).then((charts: ChartData[]) => this.charts = charts);
  }
}
