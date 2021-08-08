import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {getConnection, Repository} from "typeorm";
import {FullUserDTO, PreferencesDTO, UserDTO} from "../../shared/user-dto";
import {PreferencesEntity} from "../preferences/preferences.entity";

@Injectable()
export class UserService {

    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {
    }

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

    async getAllUsers(){
        return this.userRepository.createQueryBuilder('user')
            .select(['user.username', 'user.id'])
            .getMany();
    }

    async getAllUsersAcceptGivenId(id: string){
        return this.userRepository.createQueryBuilder('user')
            .select(['user.username', 'user.id'])
            .where('user.id != :id', {id})
            .getMany();
    }

    // async getAllUsersAndPreferencesAcceptGivenId(id: string){
    //     // this.userRepository.createQueryBuilder('user')
    //     //     .leftJoinAndSelect('user.preferences', 'p')
    //     //     .where('user.id != :id', {id})
    //     //     .getMany()
    //
    //     return createQueryBuilder('user')
    //         .leftJoinAndSelect('preferences', 'p')
    //         .where('user.id = 2')
    //         .getMany();
    // }

    async addUser(body: FullUserDTO) {
        let userEntity = this.buildUserEntity(body.user);
        let preferences = this.buildPreferencesEntity(body.preferences);
        preferences.user = userEntity;

        await this.userRepository.save(userEntity);
        await getConnection().manager.save(preferences);
        return body;
    }

    async updateUser(body: FullUserDTO) {
        let userEntity = this.buildUserEntity(body.user);
        let preferences = this.buildPreferencesEntity(body.preferences);

        return Promise.all([
            this.userRepository.createQueryBuilder()
                .update(UserEntity)
                .set(userEntity)
                .where('user_id = :id', {id: body.user.userId})
                .execute(),
            getConnection().manager.createQueryBuilder()
                .update(PreferencesEntity)
                .set({
                    coffee: preferences.coffee,
                    tea: preferences.tea,
                    sugar: preferences.sugar,
                    milk: preferences.milk,
                    drinkType: preferences.drinkType,
                    note: preferences.note,
                    avatar: preferences.avatar,
                })
                .where('user_id = :id', {id: body.user.userId})
                .execute()]);
    }

    private buildUserEntity(user: UserDTO): UserEntity {
        return new UserEntity(user.username, user.password);
    }

    private buildPreferencesEntity(preferences: PreferencesDTO) {
        return new PreferencesEntity(
            preferences.coffee,
            preferences.tea,
            preferences.sugar,
            preferences.milk,
            preferences.note,
            preferences.drink_type,
            preferences.avatar);
    }
}