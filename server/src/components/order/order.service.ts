import {Injectable, Logger} from "@nestjs/common";
import {OrderDalService} from "./order-dal.service";
import {OrderUtils} from "./order.utils";
import {UUIDService} from "../../services/uuid-service";
import {HttpErrorObject, HttpResponseService} from "../../services/http/http-response.service";
import {HttpStatusCodeEnum} from "../../services/http/http-status-code.enum";

@Injectable()
export class OrderService {

    constructor(private orderDalService: OrderDalService,
                private orderUtils: OrderUtils,
                private uuidService: UUIDService,
                private httpResponseService: HttpResponseService) {
    }

    private context = OrderService.name;
    private logger = new Logger(this.context);

    async openOrder(userId: string): Promise<any | HttpErrorObject> {
        this.logger.log(`openOrder started`, this.context)
        let order = await this.orderDalService.getActiveOrder();
        if (order) {
            const currOrderId = order['order_id'];

            if (this.isOrderTimeoutPassed(order)) {
                this.logger.log(`deactivating old order, and open new one`, this.context)
                await this.orderDalService.deactivateOrderById(currOrderId);
                const newOrderId = this.uuidService.generateUUID();
                await this.orderDalService.createNewOrder(newOrderId, userId);
                return newOrderId;
            } else {
                const message = 'there is an active order already.';
                this.logger.log(message, this.context)
                return Promise.reject(this.httpResponseService.buildErrorObj(message, HttpStatusCodeEnum.CONFLICT));
            }
        } else {
            this.logger.log(`opening new order`, this.context)
            const newOrderId = this.uuidService.generateUUID();
            await this.orderDalService.createNewOrder(newOrderId, userId);
            return newOrderId;
        }
    }

    async updateUserResponse(body): Promise<any | HttpErrorObject> {
        this.logger.log(`updateUserResponse started. userId: ${body.userId}`, this.context)
        let userResponse = await this.orderDalService.getUserResponse(body);
        if (!userResponse) {
            this.logger.log(`saving user response. userId: ${body.userId}`, this.context)
            return this.orderDalService.updateUserResponse(body);
        } else {
            const message = `user responded already. userId: ${body.userId}`;
            this.logger.log(message, this.context)
            return Promise.reject(this.httpResponseService.buildErrorObj(message, HttpStatusCodeEnum.CONFLICT));
        }
    }

    getActiveOrderDetails(){
        this.logger.log(`getActiveOrderDetails started.`, this.context)
        try {
            return this.orderDalService.getActiveOrderDetails();
        } catch (err){
            return Promise.reject(this.httpResponseService.buildErrorObj(err, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR));
        }
    }

    private isOrderTimeoutPassed(order: any) {
        let orderTime = new Date(order['order_time']);
        let currTime = new Date(this.orderUtils.getCurrDate());
        let timeDiff = currTime.getTime() - orderTime.getTime();
        let minuteDiff = timeDiff / 1000 / 60;
        return minuteDiff > 3;
    }
}