import {Injectable} from "@nestjs/common";
import {Sqlite} from "../../../public/DB/db";
import {SQL} from "../../../public/DB/sql-commands";

@Injectable()
export class StatsDalService{

    constructor(private sqlite: Sqlite) {
    }

    getUserOrderCalls(userId: string){
        return this.sqlite.db.all(SQL.orders_stats_getAllUserOrdersByUserId, [userId]);
    }

    getOrderAccepts(userId: string){
        return this.sqlite.db.all(SQL.orders_stats_responses_getOrderResponsesByUserId, [userId]);
    }
}