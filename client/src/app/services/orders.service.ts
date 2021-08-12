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
      let response: HttpResponse | any;
      try {
        // todo send user as object (search for more cases like this)
        response = await this.httpService.sendPostRequest('orders/newOrder', this.localUserService.getUser());
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
