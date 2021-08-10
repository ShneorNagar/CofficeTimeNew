import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OrderEntity} from "../entities/order.entity";
import {Repository} from "typeorm";
import {OrderUtils} from "../../components/order/order.utils";

Injectable()
export class OrdersRepository {

    ACTIVE_ORDER = 1;
    DEACTIVATE_ORDER = 0;

    constructor(@InjectRepository(OrderEntity)
                private readonly ordersRepository: Repository<OrderEntity>,
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
            .update(OrderEntity)
            .set({isOrderActive: this.DEACTIVATE_ORDER})
            .where('order_id = :orderId', {orderId})
            .execute();
    }

    // todo test
    async createNewOrder(userId: string){
        return this.ordersRepository
            .createQueryBuilder('order')
            .insert()
            .into(OrderEntity)
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