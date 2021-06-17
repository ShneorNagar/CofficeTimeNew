import { Injectable } from '@angular/core';
import {HttpService} from "./http/http.service";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private httpService: HttpService) { }

  getAvatars(){
    return this.httpService.sendGetRequest('config/avatars');
  }
}
