import {Injectable} from "@angular/core";
import {UserDTO, UserEntity} from "../../shared/entities/user-entity";
import {Subject} from "rxjs";

@Injectable({providedIn: "root"})
export class LocalUserService {

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

  private submitUser(){
    this.userSub.next(JSON.parse(localStorage.getItem(this.USER_KEY)));
  }

  public isUserLoggedIn(): boolean{
    return (!!this.getUser());
  }
}
