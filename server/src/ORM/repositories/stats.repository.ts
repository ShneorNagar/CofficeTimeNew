import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {UserEntity} from "../entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {OrderEntity} from "../entities/order.entity";
import {OrderResponseEntity} from "../entities/order-response.entity";

@Injectable()
export class StatsRepository {

    constructor(@InjectRepository(UserEntity)
                private readonly userRepository: Repository<UserEntity>) {
    }

    async getUserOrderCalls(id: string){
        return this.userRepository
            .createQueryBuilder('user')
            .select(['user.username as username', 'o.orderTime as time'])
            .where('user.id = :id', {id})
            .andWhere('o.callerId = :id', {id})
            .innerJoin(OrderEntity, 'o')
            .getRawMany()
    }

    async getOrderAccepts(id: string){
        return this.userRepository
            .createQueryBuilder('user')
            .select(['user.username as username', 'r.responseTime as time'])
            .where('user.id = :id', {id})
            .andWhere('r.userId = :id', {id})
            .innerJoin(OrderResponseEntity, 'r')
            .getRawMany();
    }
}