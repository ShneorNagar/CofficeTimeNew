import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "./user.entity";

@Entity('SUBSCRIPTIONS')
export class SubscriptionEntity {

    @PrimaryGeneratedColumn('increment', {name: 'id'})
    subscriptionId

    @OneToOne(type => UserEntity) @JoinColumn({name: 'user_id'})
    user: UserEntity;

    @Column()
    username: string

    @Column()
    subscription: string;
}