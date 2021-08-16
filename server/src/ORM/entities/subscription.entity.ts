import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "./user.entity";

@Entity('SUBSCRIPTIONS')
export class SubscriptionEntity {

    @PrimaryGeneratedColumn('increment', {name: 'id'})
    subscriptionId

    @Column()
    subscription: string;

    @Column({name: 'user_id'})
    userId: string

    @OneToOne(type => UserEntity)
    @JoinColumn({name: 'user_id'})
    user: UserEntity;
}