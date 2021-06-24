import {Injectable} from "@nestjs/common";
import {Sqlite} from '../../../public/DB/db';
import {SQL} from '../../../public/DB/sql-commands';

@Injectable()
export class PushDalService {

    constructor(private sqlite: Sqlite) {
    }

    getUserSubscription(userId: string){
        return this.sqlite.db.get(SQL.subscription_getByUserId, [userId]);
    }

    insertNewSubscription(subscription: any, username: string, userId: string){
        const subscriptionStr = JSON.stringify(subscription);
        return this.sqlite.db.run(SQL.subscription_createSubscription, [subscriptionStr, username, userId]);
    }

    getGroupSubscriptions(user_id){
        return this.sqlite.db.all(SQL.subscription_getOtherSubscriptions, [user_id]);
    }
}