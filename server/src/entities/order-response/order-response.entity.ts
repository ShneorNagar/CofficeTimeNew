import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {OrdersEntity} from "../orders/orders.entity";

@Entity('ORDERS_RESPONSES')
export class OrderResponseEntity {

    @PrimaryGeneratedColumn('increment')
    sequence: string;

    @Column({name: 'response_time'})
    responseTime: string;

    // todo enum
    @Column({name: 'response_value'})
    responseValue: string;

    @ManyToOne(type => OrdersEntity, order => order.orderResponses)
    order: OrdersEntity;
}