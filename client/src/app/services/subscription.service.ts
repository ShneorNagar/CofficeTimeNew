import {Injectable} from "@angular/core";
import {UserSubscription} from "./push/push-notifications-entity";
import {LocalUserService} from "./local-storage/local-user.service";
import {HttpService} from "./http/http.service";
import {ToastService} from "./toast.service";
import {UserService} from "../components/user-registration/user.service";

@Injectable({providedIn: "root"})
export class SubscriptionService {

  constructor(private httpService: HttpService,
              private localUserService: LocalUserService,
              private toastService: ToastService,
              private userService: UserService) {
  }

  sendSubscriptionToServer(sub: any) {

    if (this.localUserService.isUserLoggedIn()) {

      let userSubscription = {
        user: this.localUserService.getUser().user,
        subscription: sub
      } as UserSubscription

      this.httpService.sendPostRequest('push/newSub', userSubscription)
        .then((res) => {
          console.log(res.message);
        }).catch(err => {
        this.toastService.displayErrorToast('error printed to console')
        console.error(err);
      })
    } else {
      this.toastService.displayInfoToast('please log in first');
      this.userService.openLogInDialog();
    }
  }
}
