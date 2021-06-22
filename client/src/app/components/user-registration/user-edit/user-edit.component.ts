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

  // todo get value in better way
  private setUserAvatarAndDrinkTypeIfExist(){
    const preferencesFormVal = this.formGroup.get('preferences');
    if (preferencesFormVal){
      const avatar = !!preferencesFormVal.get('avatar').value ? preferencesFormVal.get('avatar').value : this.configService.AVATARS.default;
      this.localUserService.setAvatar(avatar);
    }
  }

  submit() {
    if (this.formGroup.valid) {
      this.setUserAvatarAndDrinkTypeIfExist();
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
