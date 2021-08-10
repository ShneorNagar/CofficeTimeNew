import {Injectable} from "@nestjs/common";
import {getRepository, Repository} from "typeorm";
import {UserEntity} from "../entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class StatsRepository {

    constructor(@InjectRepository(UserEntity)
                private readonly userRepository: Repository<UserEntity>) {
    }

    async getUserOrderCalls(id: string){
        return this.userRepository.createQueryBuilder('user')
            .select(['user.username', 'o.orderTime'])
            .where('user.id = :id', {id})
            .innerJoin('ORDERS', 'o')
            .getMany();
    }

    async getOrderAccepts(id: string){
        return this.userRepository.createQueryBuilder('user')
            .select(['user.username', 'r.responseTime'])
            .where('user.id = :id', {id})
            .innerJoin('ORDERS_RESPONSES', 'r')
            .getMany();
    }

    // .createQueryBuilder('user')
    // .select(['user.username', 'p.coffee'])
    // .where('user.id != :id', {id})
    // .leftJoin('user.preferences', 'p')
    // .getMany()
}