import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../user/user.entity";

@Entity('SUBSCRIPTIONS')
export class SubscriptionEntity {

    @PrimaryGeneratedColumn('increment', {name: 'id'})
    subscriptionId

    @Column()
    username: string

    @Column()
    subscription: string;

    @OneToOne(type => UserEntity)
    @JoinColumn({name: 'user_id'})
    user: UserEntity;
}