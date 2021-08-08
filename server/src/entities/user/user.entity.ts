import {Entity, PrimaryGeneratedColumn, Column, Unique, OneToOne, JoinColumn} from "typeorm";
import {PreferencesEntity} from "../preferences/preferences.entity";

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

    @OneToOne(type => PreferencesEntity)
    preferences: PreferencesEntity;
}
