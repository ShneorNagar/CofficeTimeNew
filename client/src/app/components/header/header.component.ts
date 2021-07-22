import {ChangeDetectionStrategy, Component, HostListener, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PrimeNGConfig} from "primeng/api";
import {DialogService} from "primeng/dynamicdialog";
import {UserState} from "../../shared/user.state";
import {UserEditComponent} from "../user-registration/user-edit/user-edit.component";
import {UserService} from "../user-registration/user.service";
import {LocalUserService} from "../../services/local-storage/local-user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveOrder, ConfigService} from "../../services/config.service";
import {ChartComponent} from "../chart/chart.component";
import {ChartService} from "../chart/chart.service";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', '../../shared/style/push-button.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnChanges {

  user: any;
  showNotifications: boolean;
  @Input() activeOrder: ActiveOrder;

  constructor(private primengConfig: PrimeNGConfig,
              public dialogService: DialogService,
              private userService: UserService,
              private localUserService: LocalUserService,
              private router: Router,
              private route: ActivatedRoute,
              private configService: ConfigService,
              private chartService: ChartService,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.user = this.localUserService.getUser();
    this.localUserService.userSub.subscribe(value => {
      this.user = value;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.activeOrder.currentValue){
      this.toastService.displayInfoToast('there is a new order')
    }
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

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  openChart() {
    const ref = this.dialogService.open(ChartComponent, {
      header: 'Chart',
      width: '70%',
      height: 'fill-content',
    });
    ref.onDestroy.subscribe(() =>{
      this.chartService.clearAll();
    })
  }
}
