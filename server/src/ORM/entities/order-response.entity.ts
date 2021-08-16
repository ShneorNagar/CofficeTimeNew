import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {OrderEntity} from "./order.entity";

@Entity('ORDERS_RESPONSES')
export class OrderResponseEntity {

    @PrimaryGeneratedColumn('increment')
    sequence: string;

    @Column({name: 'user_id'})
    userId: string;

    @Column({name: 'response_time'})
    responseTime: string;

    // todo enum
    @Column({name: 'response_value'})
    responseValue: string;

    @Column({name: 'order_id'})
    orderId: string;

    @ManyToOne(type => OrderEntity, order => order.orderResponses)
    @JoinColumn()
    order: OrderEntity;
}