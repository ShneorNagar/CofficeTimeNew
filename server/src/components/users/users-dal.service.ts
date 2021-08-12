import {Injectable} from "@nestjs/common";
import {UserDTO, FullUserDTO} from "../../shared/user-dto";
import {SQL} from '../../../public/DB/sql-commands'
import {Sqlite} from "../../../public/DB/db";

@Injectable()
export class UsersDalService {

    constructor(private sqlite: Sqlite) {
    }

    // done
    async updateUser(user: FullUserDTO): Promise<any> {
        const updateUserParams = [user.username, user.id]
        return this.sqlite.db.run(SQL.user_update, updateUserParams);
    }

    // done
    logIn(user: UserDTO): Promise<any> {
        let query = SQL.user_getUserWithPassword;
        let params = [user.username, user.password];
        return this.sqlite.db.get(query, params);
    }

    createUser(userId: string, userDto: FullUserDTO) {
        let createUserQuery = SQL.user_createUser;
        let createUserParams = [userId, userDto?.username, userDto?.password];
        return this.sqlite.db.run(createUserQuery, createUserParams);
    }

    createPreference(userId: string, userDto: FullUserDTO) {

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

    // done
    async getUser(username: string) {
        return this.sqlite.db.get(SQL.user_getUsername, [username]);
    }

    async getAllUsers(userId: any) {
        return this.sqlite.db.all(SQL.user_getAllAcceptCurrent, [userId]);
    }
}