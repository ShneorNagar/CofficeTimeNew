import {Component, OnInit} from '@angular/core';
import {PushNotificationsService} from "./services/push/push-notifications.service";
import {ConfigService} from "./services/config.service";
import {LocalUserService} from "./services/local-storage/local-user.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'CofficeTime';

  constructor(private pushService: PushNotificationsService,
              private configService: ConfigService,
              private localUserService: LocalUserService) {

  }

  async ngOnInit() {
    await this.configService.loadAvatars();
    this.pushService.subscribeToNotifications();
    this.localUserService.refresh();
  }
}
