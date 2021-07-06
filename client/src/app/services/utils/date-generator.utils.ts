export class DateGeneratorUtils{

  static getCurrDate(){
    let currDate = new Date();
    const year = currDate.getFullYear();
    const month = currDate.getMonth() + 1;
    const day = currDate.getDate();
    const hour = currDate.getHours();
    const minute = currDate.getMinutes();
    const seconds = currDate.getSeconds();

    return `${hour}:${minute}:${seconds} ${month}/${day}/${year}`
  }

}
