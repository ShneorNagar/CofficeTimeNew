import {Column, Entity, IsNull, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../user/user.entity";

@Entity('PREFERENCES')
export class PreferencesEntity {

    @PrimaryGeneratedColumn('increment', {name: 'preferences_id'})
    preferencesId

    @OneToOne(type => UserEntity) @JoinColumn({name: 'user_id'})
    user: UserEntity;

    @Column({nullable: true})
    coffee: number;

    @Column({nullable: true})
    tea: string;

    @Column({nullable: true})
    sugar: number;

    // todo enum
    @Column({nullable: true})
    milk: string;

    @Column({nullable: true})
    note: string;

    // todo enum
    @Column({name: 'drink_type', nullable: true})
    drinkType: string;

    @Column({nullable: true})
    avatar: string
}