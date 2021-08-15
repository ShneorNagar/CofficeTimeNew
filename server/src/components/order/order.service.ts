import {Injectable, Logger} from "@nestjs/common";
import {OrderUtils} from "./order.utils";
import {HttpErrorObject, HttpResponseService} from "../../services/http/http-response.service";
import {HttpStatusCodeEnum} from "../../services/http/http-status-code.enum";
import {OrdersRepository} from "../../ORM/repositories/orders.repository";
import {OrderResponseRepository} from "../../ORM/repositories/order-response.repository";
import {OrderEntity} from "../../ORM/entities/order.entity";

@Injectable()
export class OrderService {

    constructor(private orderUtils: OrderUtils,
                private httpResponseService: HttpResponseService,
                private ordersRepository: OrdersRepository,
                private orderResponseRepository: OrderResponseRepository) {
    }

    private context = OrderService.name;
    private logger = new Logger(this.context);

    // done
    async openOrder(userId: string): Promise<any | HttpErrorObject> {
        this.logger.log(`openOrder started`, this.context)

        let order: OrderEntity = await this.ordersRepository.getActiveOrder();
        if (order) {

            if (this.orderUtils.isOrderTimeoutPassed(order.orderTime)) {
                this.logger.log(`deactivating old order, and open new one`, this.context);

                await this.ordersRepository.deactivateOrderById(order.id);
                const newOrder = await this.ordersRepository.createNewOrder(userId);
                return newOrder.id;
            } else {
                const message = 'there is an active order already.';

                this.logger.log(message, this.context);
                return Promise.reject(this.httpResponseService.buildErrorObj(message, HttpStatusCodeEnum.CONFLICT));
            }
        } else {
            this.logger.log(`opening new order`, this.context);
            const newOrder = await this.ordersRepository.createNewOrder(userId);
            return newOrder.id;
        }
    }

    // done
    async updateUserResponse(body): Promise<any | HttpErrorObject> {
        this.logger.log(`updateUserResponse started. userId: ${body.userId}`, this.context);

        let userResponse = await this.orderResponseRepository.getUserResponse(body);
        if (!userResponse) {
            this.logger.log(`saving user response. userId: ${body.userId}`, this.context);
            return this.orderResponseRepository.updateUserResponse(body);
        } else {
            const message = `user responded already.`;
            this.logger.log(message, this.context)
            return Promise.reject(this.httpResponseService.buildErrorObj(message, HttpStatusCodeEnum.CONFLICT));
        }
    }

    // done
    getActiveOrderDetails(){
        this.logger.log(`getActiveOrderDetails started.`, this.context)
        try {
            return this.ordersRepository.getActiveOrderDetails();
        } catch (err){
            return Promise.reject(this.httpResponseService.buildErrorObj(err, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR));
        }
    }
}