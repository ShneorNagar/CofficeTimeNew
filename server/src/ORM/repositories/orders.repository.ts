import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OrderEntity} from "../entities/order.entity";
import {Repository} from "typeorm";
import {TimeUtils} from "../../utils/time.utils";
import {UserEntity} from "../entities/user.entity";

Injectable()
export class OrdersRepository {

    ACTIVE_ORDER = 1;
    DEACTIVATE_ORDER = 0;

    constructor(@InjectRepository(OrderEntity)
                private readonly ordersRepository: Repository<OrderEntity>,
                private orderUtils: TimeUtils) {
    }

    async getActiveOrder(){
        return this.ordersRepository.findOne({where: {isOrderActive : this.ACTIVE_ORDER}})
    }

    async deactivateOrderById(orderId: string){
        return this.ordersRepository
            .createQueryBuilder('order')
            .update(OrderEntity)
            .set({isOrderActive: this.DEACTIVATE_ORDER})
            .where('id = :orderId', {orderId})
            .execute();
    }

    async createNewOrder(userId: string){
        const order = new OrderEntity(userId, 1, this.orderUtils.getCurrDate())
        return this.ordersRepository.save(order);
    }

    async getActiveOrderDetails(){
        return this.ordersRepository
            .createQueryBuilder('order')
            .select(['order.id as id', 'order.callerId as callerId', 'order.orderTime as orderTime', 'u.username as username'])
            .where('order.isOrderActive = :isActive', {isActive: 1})
            .andWhere('u.id = order.callerId')
            .innerJoin(UserEntity, 'u')
            .getRawOne()
    }
}