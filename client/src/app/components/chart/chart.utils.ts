import {IChart} from "./chart.entity";

export class ChartUtils {

  static getYearLabels() {
    return [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
  }

  static getYearLabelsData() {
    return {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0,
      '9': 0,
      '10': 0,
      '11': 0,
      '12': 0,
    }
  }

  static getMonthLabelsData() {
    return {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0,
      '9': 0,
      '10': 0,
      '11': 0,
      '12': 0,
      '13': 0,
      '14': 0,
      '15': 0,
      '16': 0,
      '17': 0,
      '18': 0,
      '19': 0,
      '20': 0,
      '21': 0,
      '22': 0,
      '23': 0,
      '24': 0,
      '25': 0,
      '26': 0,
      '27': 0,
      '28': 0,
      '29': 0,
      '30': 0,
      '31': 0,
    }
  }

  static getDaysOfMonths() {
    return {
      '1': 31,
      '2': 28,
      '3': 31,
      '4': 30,
      '5': 31,
      '6': 30,
      '7': 31,
      '8': 31,
      '9': 30,
      '10': 31,
      '11': 30,
      '12': 31
    }
  }

  static getDayLabels(datesOfLastWeek) {
    let dates = [];
    Object.keys(datesOfLastWeek).forEach(date =>{
      let splitDate = date.split('/');
      dates.push(`${splitDate[1]}/${splitDate[0]}`);
    })
    return dates;
  }

  static buildChartData(yAxisData, xAxisData, label, color): IChart {
    return {
      labels: xAxisData,
      responsive: true,
      datasets: [
        {
          label,
          data: yAxisData,
          fill: false,
          borderColor: color
        }
      ]
    }
  }

  static buildDataset(yAxisData, label, color){
    return [{
      label,
      data: yAxisData,
      fill: false,
      borderColor: color
    }]
  }

  static updateDataset(originalDataset, yAxisData, label, color){
    return [
      ...originalDataset,
      {
        label,
        data: yAxisData,
        fill: false,
        borderColor: color
      }
    ]
  }

  static getMonthFromDate(fullDate: string) {
    return this.extractDate(fullDate).split('/')[0];
  }

  static getDayFromDate(fullDate: string) {
    return this.extractDate(fullDate).split('/')[1];
  }

  private static extractDate(date: string) {
    return date.split(' ')[1];
  }

  static getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
