import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {getConnection, Repository, UpdateResult} from "typeorm";
import {FullUserDTO, UserDTO} from "../../shared/user-dto";
import {PreferencesEntity} from "../preferences/preferences.entity";

@Injectable()
export class UserService {

    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

    getUserByNameAndPassword(username: string, password: string): Promise<UserEntity> {
        return this.userRepository.createQueryBuilder('user')
            .where('user.username = :username', {username})
            .andWhere('user.password = :password', {password})
            .getOne()
    }

    async getUserByName(username: string): Promise<UserEntity> {
        const result = await this.userRepository.find({username});
        return result[0];
    }

    // todo update password
    updateUsernameById(username: string, id: string): Promise<UpdateResult> {
        return this.userRepository.createQueryBuilder('user')
            .update(UserEntity)
            .set({username: username})
            .where('user_id = :id', {id})
            .execute();
    }

    async addUser(body: FullUserDTO){
        let preferences = new PreferencesEntity(body.preferences.coffee,
            body.preferences.tea,
            body.preferences.sugar,
            body.preferences.milk,
            body.preferences.note,
            body.preferences.drink_type,
            body.preferences.avatar);

        let userEntity = new UserEntity(body.user.username, body.user.password);

        await this.userRepository.save(userEntity);
        preferences.user = userEntity;
        await getConnection().manager.save(preferences)
    }

}