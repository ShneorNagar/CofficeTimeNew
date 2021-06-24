import {Injectable} from "@nestjs/common";
import {UserDTO, UserEntity} from "../../shared/user-entity";
import {SQL} from '../../../public/DB/sql-commands'
import {Sqlite} from "../../../public/DB/db";

@Injectable()
export class UsersDalService {

    constructor(private sqlite: Sqlite) {
    }

    async updateUser(data: UserEntity): Promise<any> {
        const updateUserParams = [data.user.username, data.user.userId]
        return this.sqlite.db.run(SQL.user_update, updateUserParams);
    }

    async updatePreferences(data: UserEntity): Promise<any> {
        const updatePreferencesParam = [
            data.preferences.coffee,
            data.preferences.tea,
            data.preferences.sugar,
            data.preferences.milk,
            data.preferences.note,
            data.preferences.drink_type,
            data.preferences.avatar,
            data.user.userId
        ]
        return this.sqlite.db.run(SQL.preferences_update, updatePreferencesParam);
    }

    logIn(user: UserDTO): Promise<any> {
        let query = SQL.user_getUserWithPassword;
        let params = [user.username, user.password];
        return this.sqlite.db.get(query, params);
    }

    createUser(userId: string, userDto: UserEntity) {
        let createUserQuery = SQL.user_createUser;
        let createUserParams = [userId, userDto.user?.username, userDto.user?.password];
        return this.sqlite.db.run(createUserQuery, createUserParams);
    }

    createPreference(userId: string, userDto: UserEntity) {

        let preferenceParams = [userDto.preferences?.coffee,
            userDto.preferences?.tea,
            userDto.preferences?.sugar,
            userDto.preferences?.milk,
            userDto.preferences?.note,
            userDto.preferences?.drink_type,
            userDto.preferences.avatar,
            userId];
        return this.sqlite.db.run(SQL.preferences_createPreferences, preferenceParams);
    }

    async getUser(username: string) {
        return this.sqlite.db.run(SQL.user_getUsername, [username]);
    }

    buildUserObject(row: any) {
        return {
            user: {
                username: row['username'],
                userId: row['user_id']
            },
            preferences: {
                coffee: row['coffee'],
                tea: row['tea'],
                sugar: row['sugar'],
                milk: row['milk'],
                note: row['note'],
                drink_type: row['drink_type'],
                avatar: row['avatar']
            }
        } as UserEntity
    }
}