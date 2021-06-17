import {Injectable} from "@angular/core";
import {LocalUserService} from "../../services/local-storage/local-user.service";
import {UserEntity} from "../../shared/entities/user-entity";
import {UserResponseEnum} from "./user-response.enum";
import {UserEditComponent} from "../user-registration/user-edit/user-edit.component";
import {DialogService} from "primeng/dynamicdialog";
import {UserState} from "../../shared/user.state";
import {UserService} from "../user-registration/user.service";
import {HttpService} from "../../services/http/http.service";
import {ToastService} from "../../services/toast.service";

@Injectable({providedIn: "root"})
export class UserResponseService {

  userEntity: UserEntity;

  constructor(private httpService: HttpService,
              public dialogService: DialogService,
              private userService: UserService,
              private localUserService: LocalUserService,
              private toastService: ToastService) {
    this.userEntity = this.localUserService.getUser();
    this.localUserService.userSub.subscribe(value => {
      this.userEntity = value;
    })
  }

  private SERVER_RESPONSE_PATH = 'orders/response';

  accept(orderId: string) {
    let req = this.buildReqBody(UserResponseEnum.ACCEPT, orderId);
    this.sendRequest(req);
  }

  acceptCustom(orderId: string) {
    const state = UserState.PREFERENCES;
    const ref = this.dialogService.open(UserEditComponent, {
      header: 'set your favorite',
      width: '35%',
      height: 'fill-content',
      data: {state: state.valueOf()}
    });
    ref.onClose.subscribe(value => {
      // TODO add route in server
      // if (value) {
      //   this.httpService.sendPostRequest(`users/${UserState.PREFERENCES}`, value)
      //     .then(() => {
      //       let req = this.buildReqBody(UserResponseEnum.ACCEPT, orderId);
      //       this.sendRequest(req);
      //     })
      //     .catch();
      // }
    })
  }

  decline(orderId: string) {
    let req = this.buildReqBody(UserResponseEnum.DECLINE, orderId);
    this.sendRequest(req);
  }

  private sendRequest(data: any) {
    this.httpService.sendPostRequest(`${this.SERVER_RESPONSE_PATH}`, data)
      .then(response => {
        this.httpService.displayToastByResponse(response);
      })
      .catch(err => {
        this.toastService.displayErrorToast('error printed to console')
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
