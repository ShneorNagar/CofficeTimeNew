import {Component, OnInit} from '@angular/core';
import {ConfigService} from "../../../services/config.service";
import {DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-user-avatar-edit',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.css']
})
export class UserAvatarComponent implements OnInit {

  avatars: any[];

  constructor(private configService: ConfigService,
              public ref: DynamicDialogRef) { }

  ngOnInit(): void {
    this.configService.getAvatars()
      .then(res =>{
        this.avatars = res.value;
      })
      .catch(err =>{
        console.log(err);
      });
  }

  setAvatar($event: MouseEvent) {
    const selectedAvatar = $event.target['currentSrc'];

    if (selectedAvatar){
      this.ref.close({
        avatar: selectedAvatar
      });
    }
  }
}
