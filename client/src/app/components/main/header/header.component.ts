import {Component, OnInit} from '@angular/core';
import {PrimeNGConfig} from "primeng/api";
import {DialogService} from "primeng/dynamicdialog";
import {UserState} from "../../../shared/user.state";
import {UserEditComponent} from "../../user-registration/user-edit/user-edit.component";
import {UserService} from "../../user-registration/user.service";
import {LocalUserService} from "../../../services/local-storage/local-user.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', '../../../shared/style/push-button.css']
})
export class HeaderComponent implements OnInit {

  user: any;
  position: string = 'bottom';
  displayLogInErrorDialog: boolean = false;
  isOrderActive: boolean;

  constructor(private primengConfig: PrimeNGConfig,
              public dialogService: DialogService,
              private userService: UserService,
              private localUserService: LocalUserService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.user = this.localUserService.getUser();
    this.localUserService.userSub.subscribe(value => {
      this.user = value;
    })
  }

  public get state() {
    return UserState;
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

  navigateToHome() {
    this.router.navigate(['main'], {relativeTo: this.route})
  }
}
