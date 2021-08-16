import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {ActiveOrder} from "../../services/config.service";
import {UserResponseEnum} from "../../shared/user-response.enum";
import {UserEntity} from "../../shared/entities/user-entity";
import {HttpService} from "../../services/http/http.service";
import {LocalUserService} from "../../services/local-storage/local-user.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent implements OnChanges{

  private SERVER_RESPONSE_PATH = 'orders/response';
  @Output() toggleShowNotifications: EventEmitter<any> = new EventEmitter<any>();

  @HostListener('click', ['$event.target'])
  onClick(el) {
    if (el.id == 'notif-wrapper'){
      this.toggleShowNotifications.emit();
    }
  }

  @Output() responseSent: EventEmitter<any> = new EventEmitter();
  @Input() order: ActiveOrder;
  userEntity: UserEntity;
  title: string;
  isOrderActive: boolean;

  constructor(private httpService: HttpService,
              private localUserService: LocalUserService) {
    this.userEntity = this.localUserService.getUser();
    this.localUserService.userSub.subscribe(value => {
      this.userEntity = value;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.order = changes.order?.currentValue?.value;
    this.title = !!this.order ? `new order from ${this.order.username}` : 'no orders found';
    this.isOrderActive = !!this.order;
  }

  accept() {
    let reqBody = this.buildReqBody(UserResponseEnum.ACCEPT, this.order.id);
    this.sendRequest(reqBody);
    this.responseSent.emit();
  }

  decline() {
    let reqBody = this.buildReqBody(UserResponseEnum.DECLINE, this.order.id);
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
      userId: this.userEntity.id,
      value,
      orderId
    }
  }
}
