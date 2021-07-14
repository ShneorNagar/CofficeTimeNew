import {Injectable} from '@angular/core';
import {HttpService} from "../../services/http/http.service";
import {LocalUserService} from "../../services/local-storage/local-user.service";
import {CupSummary, Order} from "./chart.entity";
import {ChartUtils} from "./chart.utils";

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  chartYear;
  chartMonth;

  private SERVER_CHART_URL = 'chart'
  private ordersCalls: number;
  private ordersAccepts: number;
  private cupsSum: number;

  private allOrders;

  constructor(private httpService: HttpService,
              private localUserService: LocalUserService) {
  }

  async init() {
    try {
      const userId = this.localUserService.getUser().user.userId;
      const res = await this.httpService.sendGetRequest(`${this.SERVER_CHART_URL}/userCupsSum`, {userId});

      this.allOrders = res.value.ordersAccepts.concat(res.value.ordersCalls);
      this.buildSumNumbers(res);
      this.buildCharts()
    } catch (err){
      console.log(err);
    }
  }

  /**
   * @param orders
   * @param month - format: MM
   * @param year - format: YYYY
   * @return orders array filtered by date
   */
  filterByDate(orders: Order[], month: string, year: string): Order[]{
    const regex = ChartService.generateRegex(month, year);
    return orders.filter(order => order.time.match(regex));
  }

  private static generateRegex(month: string, year: string){
    const regex = `.+${month ?? '[0-9]+'}\/[0-9]+\/${year ?? '[0-9]+'}`
    return new RegExp(regex, 'g');
  }

  private buildSumNumbers(res){
    this.ordersCalls = res.value.ordersCalls.length;
    this.ordersAccepts = res.value.ordersAccepts.length;
    this.cupsSum = this.ordersCalls + this.ordersAccepts;
  }

  private buildCharts() {
    const date = new Date();
    const YEAR: string = date.getFullYear().toString();
    const MONTH: string = (date.getMonth() + 1).toString();

    const ordersFilterByYear = this.filterByDate(this.allOrders,null, YEAR);
    this.chartYear = this.buildChartYear(ordersFilterByYear);

    const ordersFilterByMonth = this.filterByDate(this.allOrders, MONTH, YEAR);
    this.chartMonth = this.buildChartMonth(ordersFilterByMonth);

    this.buildChartWeek(ordersFilterByYear)
  }

  private buildChartWeek(orders: Order[]){
    let datesOfLastWeek = this.getLastWeekDates();
    const datesKeys = Object.keys(datesOfLastWeek);
    console.log(orders)
    orders.forEach(order => {
      let index = datesKeys.indexOf(order.time.split(' ')[1]);
      if (index !== -1){
        datesOfLastWeek[datesKeys[index]]++;
      }
    })
    console.log(datesOfLastWeek)
  }

  private buildChartMonth(orders: Order[]){
    let labels = ChartUtils.getMonthLabelsData();
    orders.forEach(order =>{
      let dayAsKey = ChartUtils.getDayFromDate(order.time);
      labels[dayAsKey]++;
    })
    const yAxisValues = Object.values(labels);
    const xAxisValues = Object.keys(ChartUtils.getMonthLabelsData());
    const title = orders[0].username;
    const color = '#bf42f5';
    return ChartUtils.buildChartData(yAxisValues,xAxisValues, title, color);
  }

  private buildChartYear(orders: Order[]){
    let labels = ChartUtils.getYearLabelsData();
    orders.forEach(order => {
      let monthAsKey = ChartUtils.getMonthFromDate(order.time);
      labels[monthAsKey]++;
    })
    const yAxisValues = Object.values(labels);
    const xAxisValues = ChartUtils.getYearLabels();
    const title = orders[0].username;
    const color = '#42A5F5';
    return ChartUtils.buildChartData(yAxisValues,xAxisValues, title, color);
  }

  getCupsSummary(): CupSummary[] {
    return [
      {
        count: this.ordersCalls,
        description: 'order calls'
      },
      {
        count: this.ordersAccepts,
        description: 'order accepts'
      },
      {
        count: this.cupsSum,
        description: 'total'
      }
    ]
  }

  private getLastWeekDates(): {date: string, amount: number} {

    const date = new Date()
    let day = 1;
    let month = 7;
    let year = date.getFullYear();
    let dates = [];

    while (dates.length <= 6){
      let date = `${month}/${day}/${year}`;
      if (date && this.validateDate(day, month)){
        dates.push(date);
      }

      day--;
      if (!day){
        day = 31;
        month--;
        if (!month){
          month = 12;
          year--;
          if (!year){
            year = new Date().getFullYear() - 1;
          }
        }
      }
    }
    return this.buildWeekObj(dates);
  }

  private validateDate(day: number, month: number) {
    return day <= ChartUtils.getDaysOfMonths()[month];
  }

  private buildWeekObj(dates: string[]){
    let datesAsObj;
    dates.forEach(date => {
      datesAsObj = {
        ...datesAsObj,
        [date] : 0
      }
    })
    return datesAsObj;
  }
}

