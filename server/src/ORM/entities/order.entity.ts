import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {OrderResponseEntity} from "./order-response.entity";

@Entity('ORDERS')
export class OrderEntity {

    @PrimaryGeneratedColumn("uuid", {name: 'order_id'})
    readonly id: string;

    @Column({name: 'caller_id'})
    callerId: string;

    @Column({name: 'is_order_active'})
    isOrderActive: number;

    @Column({name: 'order_time'})
    orderTime: string;

    @OneToMany(type => OrderResponseEntity, orderResponse => orderResponse.order)
    readonly orderResponses: OrderResponseEntity;

}