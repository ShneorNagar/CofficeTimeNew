import { Injectable } from '@angular/core';
import {SwPush} from "@angular/service-worker";
import {SubscriptionService} from "../subscription.service";
import {ConfirmationService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  confirmRef: ConfirmationService;

  constructor(private swPush: SwPush,
              private subscriptionService: SubscriptionService,
              private confirmationService: ConfirmationService,
              private router: Router,
              private route: ActivatedRoute) {

    this.swPush.notificationClicks.subscribe( arg => {
      let orderId = arg.notification.data.orderId;
      console.log(arg.notification.data);

      this.router.navigate(['reaction'], {relativeTo: this.route, queryParams: {orderId: orderId}})
    });
  }

  subscribeToNotifications() {
    console.log('subscribeToNotifications started')
    this.swPush.requestSubscription({
      serverPublicKey: 'BCpSFWfgVVfw3eiPPNPYgtMQhuCehgkw_tq4XfmWWS1BiRop9KA4aw68VK3RORYExeEWR8_oOz8A9GjK5w4YK84'
    }).then(sub => {
      console.log('sending subscription')
      this.subscriptionService.sendSubscriptionToServer(sub);
      this.confirmRef.close();
    })
      .catch(err => {
        console.error("Could not subscribe to notifications", err);
        this.confirmRef = this.confirmationService.confirm({
          message: `you have to enable push notifications in order to get cofficeTime orders notifications`,
          header: 'Warning',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'enable',
          rejectLabel: 'I dont care',
          accept: ()=>{
            this.subscribeToNotifications();
          }
        })
      });
    console.log('subscribeToNotifications ended')
  }

}
