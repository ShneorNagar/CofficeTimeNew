import {Injectable, OnInit} from '@angular/core';
import {HttpService} from "./http/http.service";

export interface Avatars {
  all: string[],
  default: string
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  cacheAvatars: string[] = [];
  cacheDefaultAvatar: string;
  public AVATARS: Avatars;

  constructor(private httpService: HttpService) {
  }

  async loadAvatars() {
    this.AVATARS = await this.getAvatars();
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
}
