import {Injectable} from "@angular/core";
import {LocalUserService} from "./local-storage/local-user.service";
import {UserService} from "../components/user-registration/user.service";
import {HttpService} from "./http/http.service";
import {ToastService} from "./toast.service";
import {HttpResponse} from "./http/http-response";

@Injectable({providedIn: "root"})
export class OrdersService {

  constructor(private httpService: HttpService,
              private localUserService: LocalUserService,
              private userService: UserService,
              private toastService: ToastService) {
  }

  async sendNewOrderRequest(): Promise<HttpResponse> {
    if (this.localUserService.isUserLoggedIn()) {
      let usernameAsObject = {
        username: this.localUserService.getUser().user.username
      }
      let response: HttpResponse | any;
      try {
        response = await this.httpService.sendPostRequest('orders/newOrder', usernameAsObject);
        this.toastService.displayInfoToast('new order request sent.');
        this.httpService.displayToastByResponse(response);
        return response;
      } catch (err) {
        response = err;
        this.toastService.displayErrorToast('error printed to console')
        console.error(err);
        return response;
      }
    } else {
      this.toastService.displayInfoToast('please log in first');
      this.userService.openLogInDialog();
    }
  }
}
