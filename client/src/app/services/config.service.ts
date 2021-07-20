import {Injectable, OnInit} from '@angular/core';
import {HttpService} from "./http/http.service";
import {HttpResponse} from "./http/http-response";
import {DateGeneratorUtils} from "./utils/date-generator.utils";

export interface Avatars {
  all: string[],
  default: string
}

export interface ActiveOrder{
  order_id: string;
  order_time: string;
  caller_id: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public AVATARS: Avatars;
  cacheAvatars: string[] = [];
  cacheDefaultAvatar: string;


  constructor(private httpService: HttpService) {
  }

  async loadAllUsers(userId){
    return await this.httpService.sendGetRequest('users/allUsers',{userId});
  }

  async loadAvatars() {
    this.AVATARS = await this.getAvatars();
  }

  async loadActiveOrder(): Promise<ActiveOrder | null>{
    try {
      const res = await this.getActiveOrder();
      const order: ActiveOrder = res['value'];
      const isOrderTimeOut = ConfigService.calculateOrderTimeOut(order);
      return isOrderTimeOut ? null : order;
    } catch (err){
      console.error(`error while getting active order.`)
      console.error(err);
    }
  }

  private async getAvatars(): Promise<Avatars> {
    if (this.cacheAvatars.length == 0 && !this.cacheDefaultAvatar) {
      const avatarsFromServer = await this.httpService.sendGetRequest('config/avatars');
      avatarsFromServer.value.map(avatar => this.cacheAvatars.push(avatar.content));
      this.cacheDefaultAvatar = avatarsFromServer.value.find(avatar => avatar.fileName === 'default.png').content
    }
    return {
      all: this.cacheAvatars,
      default: this.cacheDefaultAvatar
    }
  }

  private async getActiveOrder(): Promise<HttpResponse>{
    return this.httpService.sendGetRequest('orders/activeOrderDetails');
  }

  private static calculateOrderTimeOut(order){
    let orderTime = new Date(order['order_time']);
    let currTime = new Date(DateGeneratorUtils.getCurrDate());
    let timeDiff = currTime.getTime() - orderTime.getTime();
    let minuteDiff = timeDiff / 1000 / 60;
    return minuteDiff > 3;
  }
}
