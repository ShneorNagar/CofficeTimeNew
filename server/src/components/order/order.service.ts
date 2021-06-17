import {Injectable} from "@nestjs/common";
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

    async openOrder(): Promise<any | HttpErrorObject> {
        let order = await this.orderDalService.getActiveOrder();
        if (order) {
            const currOrderId = order['order_id'];

            if (this.isOrderTimeoutPassed(order)) {
                await this.orderDalService.deactivateOrderById(currOrderId);
                const newOrderId = this.uuidService.generateUUID();
                await this.orderDalService.createNewOrder(newOrderId);
                return newOrderId;
            } else {
                const message = 'there is an active order already.';
                return Promise.reject(this.httpResponseService.buildErrorObj(message, HttpStatusCodeEnum.CONFLICT));
            }
        } else {
            const newOrderId = this.uuidService.generateUUID();
            await this.orderDalService.createNewOrder(newOrderId);
            return newOrderId;
        }
    }

    async updateUserResponse(body): Promise<any | HttpErrorObject> {
        let userResponse = await this.orderDalService.getUserResponse(body);
        if (!userResponse) {
            return this.orderDalService.updateUserResponse(body);
        } else {
            const message = 'you have responded already';
            return Promise.reject(this.httpResponseService.buildErrorObj(message, HttpStatusCodeEnum.CONFLICT));
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