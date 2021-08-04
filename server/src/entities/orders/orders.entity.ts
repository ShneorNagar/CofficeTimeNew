import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {OrderResponseEntity} from "../order-response/order-response.entity";

@Entity('ORDERS')
export class OrdersEntity {

    @PrimaryGeneratedColumn("uuid", {name: 'order_id'})
    id: string;

    @Column({name: 'caller_id'})
    callerId: string;

    @Column({name: 'is_order_active'})
    isOrderActive: boolean;

    @Column({name: 'order_time'})
    orderTime: string;

    @OneToMany(type => OrderResponseEntity, orderResponse => orderResponse.order)
    orderResponses: OrderResponseEntity;
}