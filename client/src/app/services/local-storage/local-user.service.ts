import {Injectable} from "@angular/core";
import {UserDTO, UserEntity} from "../../shared/entities/user-entity";
import {Subject} from "rxjs";
import {ConfigService} from "../config.service";

@Injectable({providedIn: "root"})
export class LocalUserService {

  constructor(private configService: ConfigService) {
  }

  private USER_KEY = 'CTUser';
  userSub: Subject<UserEntity> = new Subject<UserEntity>();

  public saveUser(user: UserDTO){
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.submitUser();
  }

  public getUser(): UserEntity{
    return JSON.parse(localStorage.getItem(this.USER_KEY)) as UserEntity;
  }

  public removeUser(){
    localStorage.removeItem(this.USER_KEY);
    this.submitUser()
  }

  public isUserLoggedIn(): boolean{
    return (!!this.getUser());
  }

  refresh(){
    this.submitUser();
  }

  private submitUser(){
    this.userSub.next(JSON.parse(localStorage.getItem(this.USER_KEY)));
  }

  public setAvatar(avatar: string){
    if (this.isUserLoggedIn()){
      this.getUser().preferences.avatar = avatar ?? this.configService.AVATARS.default;
    }
    this.submitUser();
  }

  public getAvatar(): string{
    if (this.isUserLoggedIn()){
      return this.getUser().preferences.avatar ?? this.configService.AVATARS.default
    }
  }
}
