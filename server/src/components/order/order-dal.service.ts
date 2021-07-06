import {Injectable} from "@nestjs/common";
import {SQL} from '../../../public/DB/sql-commands';
import {OrderUtils} from "./order.utils";
import {Sqlite} from "../../../public/DB/db";

@Injectable()
export class OrderDalService {

    constructor(private orderUtils: OrderUtils,
                private sqlite: Sqlite) {
    }

    updateUserResponse(body: any) {
        let username = body.username;
        let responseTime = this.orderUtils.getCurrDate();
        let responseValue = body.value;
        let ownerOrderId = body.orderId;
        return this.sqlite.db.run(SQL.orders_responses_createNewResponse, [username, responseTime, responseValue, ownerOrderId]);
    }

    getUserResponse(body: any) {
        let username = body.username;
        let ownerOrderId = body.orderId;
        return this.sqlite.db.get(SQL.orders_responses_getRespondedUser, [username, ownerOrderId]);
    }

    getActiveOrder() {
        return this.sqlite.db.get(SQL.orders_getActiveOrder, []);
    }

    deactivateOrderById(orderId: any): Promise<any> {
        return this.sqlite.db.run(SQL.orders_deactivateOrder, [orderId])
    }

    createNewOrder(orderId: string, userId: string) {
        return this.sqlite.db.run(SQL.orders_createNewOrder, [orderId, userId, 1, this.orderUtils.getCurrDate()]);
    }

    getActiveOrderDetails(){
        return this.sqlite.db.get(SQL.orders_getActiveOrderDetails, [])
    }
}