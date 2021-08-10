import {Entity, PrimaryGeneratedColumn, Column, Unique, OneToOne} from "typeorm";
import {PreferencesEntity} from "./preferences.entity";

@Entity('USER')
@Unique(['username'])
export class UserEntity {

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    @PrimaryGeneratedColumn("uuid", {name: 'user_id'})
    readonly id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToOne(type => PreferencesEntity, preferences => preferences.user)
    preferences: PreferencesEntity;

}
