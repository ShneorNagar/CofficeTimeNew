import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {OrderResponseEntity} from "./order-response.entity";

@Entity('ORDERS')
export class OrderEntity {

    constructor(callerId: string, isOrderActive: number, orderTime: string) {
        this.callerId = callerId;
        this.isOrderActive = isOrderActive;
        this.orderTime = orderTime;
    }

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