import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {LocalUserService} from "../../../services/local-storage/local-user.service";
import {UserEntity} from "../../../shared/entities/user-entity";
import {DrinkTypeEnum} from "../../../shared/drink-type.enum";
import {DialogService} from "primeng/dynamicdialog";
import {UserAvatarComponent} from "./user-avatar/user-avatar.component";

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

  localUser: UserEntity;
  selectedDrinkType: DrinkType;
  drinkTypes: DrinkType[];
  milkTypes: { value: string }[];
  tempAvatarSrc: string;
  selectedMilkType: any;
  placeholder: any;

  constructor(private localUserService: LocalUserService, public dialogService: DialogService) {
    this.drinkTypes = [
      {name: 'coffee', type: DrinkTypeEnum.COFFEE, icon: 'assets/icons/coffee.png'},
      {name: 'tea', type: DrinkTypeEnum.TEA, icon: 'assets/icons/tea.png'}
    ]

    this.milkTypes = [
      {value: 'רגיל'},
      {value: 'דל לקטוז'},
      {value: 'נטול לקטוז'},
      {value: 'סויה'},
      {value: 'להקצפה בשקשוק'},
      {value: 'שקדים'},
    ]
  }

  ngOnInit(): void {
    this.localUser = this.localUserService.getUser();
    this.formGroup = new FormGroup({
      coffee: new FormControl(this.getValueByKey('coffee')),
      tea: new FormControl(this.getValueByKey('tea')),
      sugar: new FormControl(this.getValueByKey('sugar')),
      note: new FormControl(this.getValueByKey('note')),
      avatar: new FormControl(this.getValueByKey('avatar')),
      milk: new FormControl(),
      drink_type: new FormControl()
    })

    this.preferencesFormGroup.addControl('preferences', this.formGroup);

    this.avatarSrc = this.getValueByKey('avatar');
    this.selectedDrinkType = this.getSelectedDrinkType();
    this.selectedMilkType = this.getSelectedMilkType();
    this.placeholder = this.selectedMilkType ?? 'milk type'
  }

  private getSelectedDrinkType(){
    const dType = this.drinkTypes.filter(dt => dt.name == this.getValueByKey('drink_type'))[0];
    return dType ?? this.drinkTypes[0];
  }

  private getSelectedMilkType() {
    return this.localUser?.preferences?.milk ? {value: this.localUser?.preferences?.milk} : null;
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

  private getValueByKey(key: string){
    return this.localUser?.preferences?.[key] ?? '';
  }


  get drinkTypeEnum() {
    return DrinkTypeEnum;
  }
}
