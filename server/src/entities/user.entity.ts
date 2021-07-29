import {Entity, PrimaryGeneratedColumn, Column, Unique} from "typeorm";

@Entity('USER')
@Unique(['username'])
export class UserEntity {

    @PrimaryGeneratedColumn("uuid", {name: 'user_id'})
    readonly id: string;

    @Column()
    username: string;

    @Column()
    password: string;
}
