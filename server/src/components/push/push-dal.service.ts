import {Injectable} from "@nestjs/common";
import {Sqlite} from '../../../public/DB/db';
import {SQL} from '../../../public/DB/sql-commands';

@Injectable()
export class PushDalService {

    constructor(private sqlite: Sqlite) {
    }

    // todo test
    getUserSubscription(userId: string){
        return this.sqlite.db.get(SQL.subscription_getByUserId, [userId]);
    }

    // todo test
    insertNewSubscription(subscription: any, username: string, userId: string){
        const subscriptionStr = JSON.stringify(subscription);
        return this.sqlite.db.run(SQL.subscription_createSubscription, [subscriptionStr, username, userId]);
    }

    // todo test
    getGroupSubscriptions(user_id){
        return this.sqlite.db.all(SQL.subscription_getOtherSubscriptions, [user_id]);
    }
}