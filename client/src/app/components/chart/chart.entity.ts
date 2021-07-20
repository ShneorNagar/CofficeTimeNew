export class ChartData {

  private readonly _title: string;
  private readonly _chart: IChart;

  constructor(title: string, private xAxisData, dataset) {
    this._title = title;

    this._chart = {
      responsive: true,
      labels: xAxisData,
      datasets: dataset
    }
  }

  get title(){
    return this._title;
  }

  get chart(): IChart{
    return this._chart;
  }
}

export interface IChart{
  labels: string[];
  responsive: boolean;
  datasets: [{
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string
  }]
}

export interface ICupSummary {
  count: number;
  description: string;
}

export class Order {
  username: string;
  time: string;
}
