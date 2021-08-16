import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "./user.entity";

@Entity('PREFERENCES')
export class PreferencesEntity {

    constructor(coffee?: number, tea?: string, sugar?: number, milk?: string, note?: string, drinkType?: string, avatar?: string) {
        this.coffee = coffee;
        this.tea = tea;
        this.sugar = sugar;
        this.milk = milk;
        this.note = note;
        this.drinkType = drinkType;
        this.avatar = avatar;
    }

    @PrimaryGeneratedColumn('increment', {name: 'preferences_id'})
    preferencesId

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

    @OneToOne(type => UserEntity, user => user.preferences,
        {
            eager: true,
            cascade: true,
            onDelete: "CASCADE",
            orphanedRowAction: "delete"
        })
    @JoinColumn({name: 'user_id'})
    user: UserEntity;
}