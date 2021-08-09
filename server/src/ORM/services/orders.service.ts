import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OrdersEntity} from "../entities/orders.entity";
import {Repository} from "typeorm";
import {OrderUtils} from "../../components/order/order.utils";

Injectable()
export class OrdersService{

    ACTIVE_ORDER = 1;
    DEACTIVATE_ORDER = 0;

    constructor(@InjectRepository(OrdersEntity)
                private readonly ordersRepository: Repository<OrdersEntity>,
                private orderUtils: OrderUtils) {
    }

    // todo test
    async getActiveOrder(){
        return this.ordersRepository.find({where: {isOrderActive : this.ACTIVE_ORDER}})
    }

    // todo test
    async deactivateOrderById(orderId: string){
        return this.ordersRepository
            .createQueryBuilder('order')
            .update(OrdersEntity)
            .set({isOrderActive: this.DEACTIVATE_ORDER})
            .where('order_id = :orderId', {orderId})
            .execute();
    }

    // todo test
    async createNewOrder(userId: string){
        return this.ordersRepository
            .createQueryBuilder('order')
            .insert()
            .into(OrdersEntity)
            .values([{
                callerId: userId,
                isOrderActive: 1,
                orderTime: this.orderUtils.getCurrDate
            }])
    }

    // todo test
    async getActiveOrderDetails(){
        return this.ordersRepository
            .createQueryBuilder('order')
            .select(['order'])
            .leftJoin('user', 'u')
            .where('user.id = :id', {id: 2})
            .andWhere('order.isOrderActive = :isActive', {isActive: 1})
            .getOne()
    }
}