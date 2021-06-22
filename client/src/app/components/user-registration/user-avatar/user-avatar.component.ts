import {Component, OnInit} from '@angular/core';
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfigService} from "../../../services/config.service";

@Component({
  selector: 'app-user-avatar-edit',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.css']
})
export class UserAvatarComponent implements OnInit {

  avatars: any[] = [];
  defaultAvatar: string;

  constructor(private configService: ConfigService,
              public ref: DynamicDialogRef) {
  }

  ngOnInit(): void {
    this.avatars = this.configService.AVATARS.all;
    this.defaultAvatar = this.configService.AVATARS.default;
  }

  setAvatar($event: MouseEvent) {
    const selectedAvatar = $event.target['currentSrc'];
    this.ref.close({
      avatar: selectedAvatar ?? this.defaultAvatar
    });
  }
}
