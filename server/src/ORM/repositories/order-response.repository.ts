import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OrderResponseEntity} from "../entities/order-response.entity";
import {Repository} from "typeorm";
import {TimeUtils} from "../../utils/time.utils";

@Injectable()
export class OrderResponseRepository {

    constructor(@InjectRepository(OrderResponseEntity)
                private readonly orderResponseRepo: Repository<OrderResponseEntity>,
                private orderUtils: TimeUtils) {
    }

    async updateUserResponse(body: any){
        let userId = body.userId;
        let responseTime = this.orderUtils.getCurrDate();
        let responseValue = body.value;
        let ownerOrderId = body.orderId;
        return this.orderResponseRepo
            .createQueryBuilder('orders')
            .insert()
            .into(OrderResponseEntity)
            .values([{
                userId,
                responseTime,
                responseValue,
                orderId: ownerOrderId
            }])
            .execute();
    }

    async getUserResponse(body: any){
        let userId = body.userId;
        let ownerOrderId = body.orderId;
        return this.orderResponseRepo.findOne({where: {userId: userId, orderId: ownerOrderId}});
    }

}
