import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MenuItem} from "primeng/api";
import {LocalUserService} from "../../../services/local-storage/local-user.service";
import {UserState} from "../../../shared/user.state";
import {UserEditComponent} from "../../user-registration/user-edit/user-edit.component";
import {DialogService} from "primeng/dynamicdialog";
import {UserService} from "../../user-registration/user.service";
import {UserEntity} from "../../../shared/entities/user-entity";

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar-banner.component.html',
  styleUrls: ['./user-avatar-banner.component.css']
})
export class UserAvatarBannerComponent implements OnInit {

  @Input() isOpenMenu: boolean;

  @ViewChild('menu') menu;

  user: UserEntity;
  menuItems: MenuItem[];
  avatar: string;

  constructor(private localUserService: LocalUserService,
              public dialogService: DialogService,
              private userService: UserService,) {
    this.user = this.localUserService.getUser();
    this.localUserService.userSub.subscribe((localUser: UserEntity) => {
      this.avatar = localUser.preferences.avatar;
    })
  }

  ngOnInit(): void {
    this.menuItems = [{
      label: 'options',
      items: [{
        label: 'Log-out',
        icon: 'pi pi-sign-out',
        command: () => this.logOut()
      }, {
        label: 'Preferences',
        icon: 'pi pi-cog',
        command: () => this.openUserData(UserState.PREFERENCES)
      }]
    }]
    this.avatar = this.user.preferences.avatar;
  }

  openUserData(state: UserState) {
    const ref = this.dialogService.open(UserEditComponent, {
      header: state.valueOf(),
      width: '35%',
      height: 'fill-content',
      data: {state: state}
    });
    ref.onClose.subscribe(value => {
      if (value) {
        this.userService.sendReqToServer(state, value.user);
      }
    })
  }

  logOut() {
    this.localUserService.removeUser();
  }

  toggle($event: MouseEvent) {
    if (this.isOpenMenu){
      this.menu.toggle($event);
    }
  }
}
