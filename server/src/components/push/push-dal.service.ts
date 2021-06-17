import {Injectable} from "@nestjs/common";
import {Sqlite} from '../../../public/DB/db';
import {SQL} from '../../../public/DB/sql-commands';

@Injectable()
export class PushDalService {

    constructor(private sqlite: Sqlite) {
    }

    getUserSubscription(username: string){
        return this.sqlite.db.get(SQL.subscription_getByUserName, [username]);
    }

    insertNewSubscription(subscription: any, username: string){
        const subscriptionStr = JSON.stringify(subscription);
        return this.sqlite.db.run(SQL.subscription_createSubscription, [subscriptionStr, username]);
    }

    getGroupSubscriptions(username){
        return this.sqlite.db.all(SQL.subscription_getOtherSubscriptions, [username]);
    }
}