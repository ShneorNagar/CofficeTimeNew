import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

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
}