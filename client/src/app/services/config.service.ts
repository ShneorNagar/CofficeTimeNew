import {Injectable, OnInit} from '@angular/core';
import {HttpService} from "./http/http.service";
import {HttpResponse} from "./http/http-response";
import {DateGeneratorUtils} from "./utils/date-generator.utils";

export interface Avatars {
  all: string[],
  default: string
}

export interface ActiveOrder{
  id: string;
  orderTime: string;
  callerId: string;
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
    return await this.httpService.sendGetRequest('users/all',{userId});
  }

  getActiveOrder(): Promise<HttpResponse>{
    return this.httpService.sendGetRequest('orders/activeOrderDetails');
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

  async loadAvatars() {
    this.AVATARS = await this.getAvatars();
  }
}
