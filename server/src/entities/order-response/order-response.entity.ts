import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {OrdersEntity} from "../orders/orders.entity";

@Entity('ORDERS_RESPONSES')
export class OrderResponseEntity {

    @PrimaryGeneratedColumn('increment')
    sequence: string;

    @ManyToOne(type => OrdersEntity) @JoinColumn({name: 'order_id'})
    order: OrdersEntity;

    @Column({name: 'response_time'})
    responseTime: string;

    // todo enum
    @Column({name: 'response_value'})
    responseValue: string;

    @Column({name: 'order_id'})
    ownerOrderId: string;
}