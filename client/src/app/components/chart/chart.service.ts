import {Injectable} from '@angular/core';
import {HttpService} from "../../services/http/http.service";
import {LocalUserService} from "../../services/local-storage/local-user.service";
import {ChartData, ICupSummary, Order} from "./chart.entity";
import {ChartUtils} from "./chart.utils";
import {HttpResponse} from "../../services/http/http-response";

enum ChartTitleEnum {
  YEAR = 'Year',
  MONTH = 'Month',
  WEEK = 'Week'
}

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  private readonly YEAR: string;
  private readonly MONTH: string;
  private readonly MAIN_CHART_COLOR = '#7014C1FF';
  private SERVER_CHART_URL = 'chart'

  private allOrders;
  private ordersCalls: number;
  private ordersAccepts: number;
  private cupsSum: number;
  private chartNames: Set<string> = new Set<string>();

  chartYearData: ChartData;
  chartMonthData: ChartData;
  chartWeekData: ChartData;
  charts: ChartData[] = [];

  constructor(private httpService: HttpService,
              private localUserService: LocalUserService) {
    const date = new Date();
    this.YEAR = date.getFullYear().toString();
    this.MONTH = (date.getMonth() + 1).toString();
  }

  async init() {
    try {
      const userId = this.localUserService.getUser().user.userId;
      const res = await this.getUserData(userId);
      this.allOrders = res.value.ordersAccepts.concat(res.value.ordersCalls);
      this.buildOrdersSum(res);
    } catch (err) {
      console.error(err);
    }
  }

  getCharts(): ChartData[] {
    return this.buildCharts(this.allOrders, this.MAIN_CHART_COLOR);
  }

  async updateChartsByUserId(userId: string): Promise<ChartData[]> {
    const res = await this.getUserData(userId);
    this.allOrders = res.value.ordersAccepts.concat(res.value.ordersCalls);
    return this.buildCharts(this.allOrders, ChartUtils.getRandomColor());
  }

  private getUserData(userId: string): Promise<HttpResponse> {
    return this.httpService.sendGetRequest(`${this.SERVER_CHART_URL}/userData`, {userId});
  }

  private buildCharts(orders: any[], color: string): ChartData[]{

    if (orders.length > 0 && this.validateChart(orders[0].username)) {
      let charts: ChartData[] = [];

      const ordersFilterByYear = this.filterByDate(orders, null, this.YEAR);
      this.chartYearData = this.buildChartYear(ordersFilterByYear, color);
      charts.unshift(this.chartYearData);

      const ordersFilterByMonth = this.filterByDate(orders, this.MONTH, this.YEAR);
      this.chartMonthData = this.buildChartMonth(ordersFilterByMonth, color);
      charts.unshift(this.chartMonthData);

      this.chartWeekData = this.buildChartWeek(orders, color);
      charts.unshift(this.chartWeekData);

      return charts;
    }
  }

  private buildOrdersSum(res) {
    this.ordersCalls = res.value.ordersCalls.length;
    this.ordersAccepts = res.value.ordersAccepts.length;
    this.cupsSum = this.ordersCalls + this.ordersAccepts;
  }

  /**
   *  Chart builders section
   * */
  private buildChartYear(orders: Order[], color: string): ChartData {
    let labels = ChartUtils.getYearLabelsData();
    orders.forEach(order => {
      let monthAsKey = ChartUtils.getMonthFromDate(order.time);
      labels[monthAsKey]++;
    })
    const yAxisValues = Object.values(labels);
    const xAxisValues = ChartUtils.getYearLabels();
    const label = orders[0].username;
    this.appendChartNames(label);
    let dataset;
    dataset = ChartUtils.updateDataset(this.chartYearData?.chart?.datasets ?? [], yAxisValues, label, color)
    return new ChartData(ChartTitleEnum.YEAR, xAxisValues, dataset);
  }

  private buildChartMonth(orders: Order[], color: string): ChartData {
    let labels = ChartUtils.getMonthLabelsData();
    orders.forEach(order => {
      let dayAsKey = ChartUtils.getDayFromDate(order.time);
      labels[dayAsKey]++;
    })
    const yAxisValues = Object.values(labels);
    const xAxisValues = Object.keys(ChartUtils.getMonthLabelsData());
    const label = orders[0].username;
    this.appendChartNames(label);
    let dataset;
    dataset = ChartUtils.updateDataset(this.chartMonthData?.chart?.datasets ?? [], yAxisValues, label, color)
    return new ChartData(ChartTitleEnum.MONTH, xAxisValues, dataset);
  }

  private buildChartWeek(orders: Order[], color: string): ChartData {
    let datesOfLastWeek = ChartUtils.getLastWeekDates();
    const datesKeys = Object.keys(datesOfLastWeek);

    orders.forEach(order => {
      let index = datesKeys.indexOf(order.time.split(' ')[1]);
      if (index !== -1) {
        datesOfLastWeek[datesKeys[index]]++;
      }
    })

    const xAxisValues = ChartUtils.getDayLabels(datesOfLastWeek);
    const yAxisValues = Object.values(datesOfLastWeek);
    const label = orders[0].username;
    this.appendChartNames(label);
    let dataset;

    dataset = ChartUtils.updateDataset(this.chartWeekData?.chart?.datasets ?? [], yAxisValues, label, color)
    return new ChartData(ChartTitleEnum.WEEK, xAxisValues, dataset);
  }

  private static generateRegex(month: string, year: string) {
    const regex = `.+${month ?? '[0-9]+'}\/[0-9]+\/${year ?? '[0-9]+'}`
    return new RegExp(regex, 'g');
  }

  getCupsSummary(): ICupSummary[] {
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

  /**
   * @param orders
   * @param month - format: MM
   * @param year - format: YYYY
   * @return orders array filtered by date
   */
  filterByDate(orders: Order[], month: string, year: string): Order[] {
    const regex = ChartService.generateRegex(month, year);
    return orders.filter(order => order.time.match(regex));
  }

  private appendChartNames(name: string) {
    this.chartNames.add(name)
  }

  private validateChart(name) {
    return !this.chartNames.has(name);
  }

  clearAll() {
    this.chartWeekData = null;
    this.chartMonthData = null;
    this.chartYearData = null;
    this.chartNames.clear();
  }
}

