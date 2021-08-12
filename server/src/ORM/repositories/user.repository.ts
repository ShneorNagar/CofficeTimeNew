import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import { getConnection, Repository} from "typeorm";
import {FullUserDTO, PreferencesDTO, UserDTO} from "../../shared/user-dto";
import {PreferencesEntity} from "../entities/preferences.entity";

@Injectable()
export class UserRepository {

    constructor(@InjectRepository(UserEntity)
                private readonly userRepository: Repository<UserEntity>) {
    }

    getUserByNameAndPassword(username: string, password: string): Promise<UserEntity> {
        return this.userRepository
            .createQueryBuilder('user')
            .select(['user'])
            .where('user.username = :username', {username})
            .andWhere('user.password = :password', {password})
            .leftJoinAndSelect('user.preferences', 'p')
            .getOne()
    }

    async getUserByName(username: string): Promise<UserEntity> {
        const result = await this.userRepository.find({username});
        return result[0];
    }

    async getAllUsersExceptGivenId(id: string){
        return this.userRepository.createQueryBuilder('user')
            .select(['user'])
            .where('user.id != :id', {id})
            .getMany();
    }

    async getAllUsersAndPreferencesAcceptGivenId(id: string) {
        return this.userRepository
            .createQueryBuilder('user')
            .select(['user'])
            .where('user.id != :id', {id})
            .leftJoinAndSelect('user.preferences', 'p')
            .getMany()
    }

    async getUserAndPreferencesById(username: string, password: string){
        return this.userRepository
            .createQueryBuilder('user')
            .select(['user'])
            .where('user.username = :username', {username})
            .andWhere('user.password = :password', {password})
            .innerJoinAndSelect('user.preferences', 'p')
            .getOne()
    }

    async addUser(user: FullUserDTO) {
        let userEntity = this.buildUserEntity(user);
        let preferences = this.buildPreferencesEntity(user.preferences);
        preferences.user = userEntity;

        await this.userRepository.save(userEntity);
        await getConnection().manager.save(preferences);
        return user;
    }

    async updatePreferences(user: FullUserDTO) {
        let preferences = this.buildPreferencesEntity(user.preferences);

        return getConnection().manager.createQueryBuilder()
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
                .where('user_id = :id', {id: user.id})
                .execute();
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