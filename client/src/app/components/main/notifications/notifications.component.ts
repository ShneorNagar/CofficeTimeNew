import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ActiveOrder} from "../../../services/config.service";
import {UserResponseEnum} from "../../user-response/user-response.enum";
import {UserEntity} from "../../../shared/entities/user-entity";
import {HttpService} from "../../../services/http/http.service";
import {LocalUserService} from "../../../services/local-storage/local-user.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {

  private SERVER_RESPONSE_PATH = 'orders/response';

  @Output() responseSent: EventEmitter<any> = new EventEmitter();
  @Input() order: ActiveOrder;
  userEntity: UserEntity;

  constructor(private httpService: HttpService,
              private localUserService: LocalUserService) {
    this.userEntity = this.localUserService.getUser();
    this.localUserService.userSub.subscribe(value => {
      this.userEntity = value;
    })
  }

  accept() {
    let reqBody = this.buildReqBody(UserResponseEnum.ACCEPT, this.order.order_id);
    this.sendRequest(reqBody);
    this.responseSent.emit();
  }

  decline() {
    let reqBody = this.buildReqBody(UserResponseEnum.DECLINE, this.order.order_id);
    this.sendRequest(reqBody);
    this.responseSent.emit();
  }

  private sendRequest(reqBody){
    this.httpService.sendPostRequest(this.SERVER_RESPONSE_PATH, reqBody)
      .then(res =>{
        this.httpService.displayToastByResponse(res);
      })
      .catch(err =>{
        console.error(err);
      })
  }

  private buildReqBody(value: UserResponseEnum, orderId: string) {
    return {
      username: this.userEntity.user.username,
      value,
      orderId
    }
  }
}
