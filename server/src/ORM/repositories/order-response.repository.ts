import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {OrderResponseEntity} from "../entities/order-response.entity";
import {Repository} from "typeorm";
import {OrderUtils} from "../../components/order/order.utils";

@Injectable()
export class OrderResponseRepository {

    constructor(@InjectRepository(OrderResponseEntity)
                private readonly orderResponseRepo: Repository<OrderResponseEntity>,
                private orderUtils: OrderUtils) {
    }

    // todo test && create type for body param
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
    }

    // todo test
    async getUserResponse(body: any){
        let userId = body.userId;
        let ownerOrderId = body.orderId;
        return this.orderResponseRepo.find({where: {userId: userId, orderId: ownerOrderId}});
    }

}
