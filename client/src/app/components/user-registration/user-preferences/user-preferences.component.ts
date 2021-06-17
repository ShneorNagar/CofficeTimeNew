import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {LocalUserService} from "../../../services/local-storage/local-user.service";
import {UserEntity} from "../../../shared/entities/user-entity";
import {DrinkTypeEnum} from "../../../shared/drink-type.enum";
import {DialogService} from "primeng/dynamicdialog";
import {UserAvatarComponent} from "../user-avatar/user-avatar.component";

interface DrinkType {
  name: string,
  type: DrinkTypeEnum,
  icon: string
}

@Component({
  selector: 'app-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.css', '../../../shared/style/input-fields.scss']
})
export class PreferencesComponent implements OnInit {

  @Input() preferencesFormGroup: FormGroup;
  formGroup: FormGroup;
  avatarSrc: string;

  get drinkTypeEnum() {
    return DrinkTypeEnum;
  }

  localUser: UserEntity;
  selectedDrinkType: DrinkType;
  drinkTypes: DrinkType[];
  tempAvatarSrc: string;

  constructor(private localUserService: LocalUserService,
              public dialogService: DialogService) {
    this.drinkTypes = [
      {name: 'coffee', type: DrinkTypeEnum.COFFEE, icon: 'assets/icons/coffee.png'},
      {name: 'tea', type: DrinkTypeEnum.TEA, icon: 'assets/icons/tea.png'}
    ]
    this.selectedDrinkType = this.drinkTypes[0];
  }

  ngOnInit(): void {
    this.localUser = this.localUserService.getUser();
    this.formGroup = new FormGroup({
      drink_type: new FormControl(),
      coffee: new FormControl(this.localUser?.preferences?.coffee ?? ''),
      tea: new FormControl(this.localUser?.preferences?.tea ?? ''),
      sugar: new FormControl(this.localUser?.preferences?.sugar ?? ''),
      milk: new FormControl(this.localUser?.preferences?.milk ?? ''),
      note: new FormControl(this.localUser?.preferences?.note ?? ''),
      avatar: new FormControl(this.localUser?.preferences?.avatar ?? '')
    })
    this.preferencesFormGroup.addControl('preferences', this.formGroup);
    this.avatarSrc = this.localUser?.preferences?.avatar ?? '';
  }

  openAvatarEdit() {
    const ref = this.dialogService.open(UserAvatarComponent, {
      header: 'avatar edit',
      width: '45%',
      height: '70%'
    });
    ref.onClose.subscribe(value => {
      if (value) {
        this.tempAvatarSrc = value.avatar;
        this.formGroup.get('avatar').setValue(value.avatar);
      }
    })
  }
}
