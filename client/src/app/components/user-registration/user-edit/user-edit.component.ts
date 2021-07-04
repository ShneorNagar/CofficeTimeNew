import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {UserState} from "../../../shared/user.state";
import {ToastService} from "../../../services/toast.service";
import {LocalUserService} from "../../../services/local-storage/local-user.service";
import {ConfigService} from "../../../services/config.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  formGroup: FormGroup;
  stateFromDialog: UserState

  public get state() {
    return UserState;
  }

  constructor(private config: DynamicDialogConfig,
              public ref: DynamicDialogRef,
              private toastService: ToastService,
              private localUserService: LocalUserService,
              private configService: ConfigService) {
    this.stateFromDialog = config.data.state;
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({});
  }

  private flattenAvatarValue(preferences: any) {
      const avatar = preferences.avatar ?? this.configService.AVATARS.default;
      return {
        ...preferences,
        avatar
      }
  }

  private flattenMilkValue(preferences: any) {
    const milkValue = preferences?.milk?.value;
    return {
      ...preferences,
      milk: milkValue
    }
  }

  private flattenDrinkTypeValue(preferences: any) {
    const drinkType = preferences?.drink_type?.name;
    return {
      ...preferences,
      drink_type: drinkType
    }
  }

  private flattenPreferencesData(preferences: any){
    let flattenFormValues = this.flattenMilkValue(preferences);
    flattenFormValues = this.flattenDrinkTypeValue(flattenFormValues);
    flattenFormValues = this.flattenAvatarValue(flattenFormValues)
    return flattenFormValues;
  }

  submit() {
    if (this.formGroup.valid) {
      if (this.formGroup.value.preferences){
        this.formGroup.value.preferences = this.flattenPreferencesData(this.formGroup.value.preferences);
        this.localUserService.setAvatar(this.formGroup.value.preferences.avatar);
      }
      this.ref.close({
        user: this.buildSubmitValue(this.formGroup.value)
      });
    } else {
      this.toastService.displayErrorToast('fill required fields')
    }
  }

  private buildSubmitValue(value) {
    if (!value.user) {
      return {
        user: {...this.localUserService.getUser().user},
        ...value
      }
    }
    return value;
  }
}
