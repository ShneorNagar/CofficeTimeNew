import {Injectable} from "@nestjs/common";
import {SQL} from '../../../public/DB/sql-commands';
import {OrderUtils} from "./order.utils";
import {Sqlite} from "../../../public/DB/db";

@Injectable()
export class OrderDalService {

    constructor(private orderUtils: OrderUtils,
                private sqlite: Sqlite) {
    }

    // todo test
    updateUserResponse(body: any) {
        let userId = body.userId;
        let responseTime = this.orderUtils.getCurrDate();
        let responseValue = body.value;
        let ownerOrderId = body.orderId;
        return this.sqlite.db.run(SQL.orders_responses_createNewResponse, [userId, responseTime, responseValue, ownerOrderId]);
    }

    // todo test
    getUserResponse(body: any) {
        let userId = body.userId;
        let ownerOrderId = body.orderId;
        return this.sqlite.db.get(SQL.orders_responses_getRespondedUser, [userId, ownerOrderId]);
    }

    // todo test
    getActiveOrder() {
        return this.sqlite.db.get(SQL.orders_getActiveOrder, []);
    }

    // todo test
    deactivateOrderById(orderId: any): Promise<any> {
        return this.sqlite.db.run(SQL.orders_deactivateOrder, [orderId])
    }

    // todo test
    createNewOrder(orderId: string, userId: string) {
        return this.sqlite.db.run(SQL.orders_createNewOrder, [orderId, userId, 1, this.orderUtils.getCurrDate()]);
    }

    // todo test
    getActiveOrderDetails(){
        return this.sqlite.db.get(SQL.orders_getActiveOrderDetails, [])
    }
}