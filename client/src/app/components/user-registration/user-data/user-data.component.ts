import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LocalUserService} from "../../../services/local-storage/local-user.service";
import {UserEntity} from "../../../shared/entities/user-entity";

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css', '../../../shared/style/input-fields.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDataComponent implements OnInit {

  @Input() userFormGroup: FormGroup;
  fromGroup;
  localUser: UserEntity;

  constructor(private localUserService: LocalUserService) {}

  ngOnInit(): void {
    this.localUser = this.localUserService.getUser();
    this.fromGroup = new FormGroup({
      username: new FormControl(this.localUser?.username ?? '', Validators.required),
      password: new FormControl(this.localUser?.password ?? '', Validators.required)
    })
    this.userFormGroup.addControl('user', this.fromGroup)
  }
}
