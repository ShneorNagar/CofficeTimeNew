import {Injectable} from "@angular/core";
import {UserState} from "../../shared/user.state";
import {LocalUserService} from "../../services/local-storage/local-user.service";
import {HttpStatusCodeEnum} from "../../services/http/http-status-code.enum";
import {HttpService} from "../../services/http/http.service";
import {UserEditComponent} from "./user-edit/user-edit.component";
import {DialogService} from "primeng/dynamicdialog";
import {ToastService} from "../../services/toast.service";
import {HttpResponse} from "../../services/http/http-response";
import {PushNotificationsService} from "../../services/push/push-notifications.service";

enum routs {
  LOG_IN = "login",
  LOG_OUT = "logout",
  REGISTER = "register",
  REACTION = 'reaction',
  UPDATE = 'update'
}

@Injectable({providedIn: "root"})
export class UserService {

  constructor(private httpService: HttpService,
              private localUserService: LocalUserService,
              public dialogService: DialogService,
              private toastService: ToastService,
              private pushNotificationsService : PushNotificationsService) {}

  public sendReqToServer(state: UserState, data: any) {
    switch (state) {
      case UserState.LOG_IN: {
        this.sendRequest(routs.LOG_IN.valueOf(), data.user);
        break;
      }
      case UserState.LOG_OUT: {
        this.sendRequest(routs.LOG_OUT.valueOf(), data);
        break;
      }
      case UserState.REGISTER: {
        this.sendRequest(routs.REGISTER.valueOf(), data);
        break;
      }
      case UserState.PREFERENCES:{
        this.sendRequest(routs.UPDATE.valueOf(), data);
        break;
      }
      case UserState.REACTION: {
        this.sendRequest(routs.REACTION.valueOf(), data);
        break;
      }
    }
  }

  private sendRequest(path: string, data: any) {
    this.httpService.sendPostRequest(`users/${path}`, data)
      .then(response => {
      this.handleResponse(response);
      })
      .catch(err => {
        this.toastService.displayErrorToast('error printed to console')
        console.error(err);
      })
  }

  private handleResponse(response: HttpResponse) {
    switch (response.statusCode) {
      case HttpStatusCodeEnum.OK: {
        let message = this.httpService.stringifyResponseMessage(response.message);
        this.toastService.displaySuccessToast('Log in', message);
        this.localUserService.saveUser(response.value);
        break;
      }
      case HttpStatusCodeEnum.CREATED:{
        let message = this.httpService.stringifyResponseMessage(response.message);
        this.toastService.displaySuccessToast('Register', message);
        this.localUserService.saveUser(response.value);
        this.pushNotificationsService.subscribeToNotifications();
        break;
      }
      case HttpStatusCodeEnum.UNAUTHORIZED: {
        let message = this.httpService.stringifyResponseMessage(response.message);
        this.toastService.displayErrorToast('Log in', message);
        break;
      }
      case HttpStatusCodeEnum.INTERNAL_SERVER_ERROR: {
        let message = this.httpService.stringifyResponseMessage(response.message);
        console.error(response.message);
        this.toastService.displayErrorToast(message);
        break;
      }
      default: {
        let message = this.httpService.stringifyResponseMessage(response.message);
        this.toastService.displayErrorToast(message);
        console.warn(response.message);
        break
      }
    }
  }

  openLogInDialog(){
    const ref = this.dialogService.open(UserEditComponent, {
      header: 'Log in',
      width: '35%',
      height: 'fill-content',
      data: {state: UserState.LOG_IN}
    });
    ref.onClose.subscribe(value => {
      if (value) {
        this.sendReqToServer(UserState.LOG_IN, value.user);
      }
    })
  }
}
