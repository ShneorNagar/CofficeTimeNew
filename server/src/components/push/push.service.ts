import * as webpush from 'web-push'
import {Injectable, Logger, OnModuleInit} from "@nestjs/common";
import {PushDalService} from "./push-dal.service";
import {SubscriptionRepository} from "../../ORM/repositories/subscription.repository";

@Injectable()
export class PushService implements OnModuleInit {

    // private pushDalService: PushDalService
    constructor(private subscriptionRepository: SubscriptionRepository) {
    }

    private context = PushService.name;
    private logger = new Logger(this.context);

    // TEMP CODE
    private readonly vapidKeys = {
        publicKey: "BCpSFWfgVVfw3eiPPNPYgtMQhuCehgkw_tq4XfmWWS1BiRop9KA4aw68VK3RORYExeEWR8_oOz8A9GjK5w4YK84",
        privateKey: "GDyGEozxx77wthpemL7udsgGx1QLMMsv-VYTFujO05w"
    }

    // todo test
    async notifyUsers(username, userId, orderId) {
            // const groupSubscriptions = await this.pushDalService.getGroupSubscriptions(userId);
            const groupSubscriptions = await this.subscriptionRepository.getGroupSubscriptions(userId);
            return this.sendPush(username, orderId, groupSubscriptions);
    }

    onModuleInit(): any {
        webpush.setVapidDetails(
            'mailto:example@yourdomain.org',
            this.vapidKeys.publicKey,
            this.vapidKeys.privateKey
        );
    }

    sendPush(username: string, orderId: string, allSubscriptions: any[]): Promise<any> {

        this.logger.log(`sendPush started. sending push notifications to ${allSubscriptions.length} users`)
        const notificationPayload = {
            "notification": {
                "title": "New CofficeTime order",
                "body": `${username} calling for CofficeTime`,
                "icon": "assets/main-page-logo-small-hat.png",
                "vibrate": [100, 50, 100],
                "data": {
                    "orderId": orderId
                },
                "actions": [{
                    "action": "Open",
                    "title": "Go to CofficeTime"
                }]
            }
        };
        return Promise.all(allSubscriptions.map(sub => webpush.sendNotification(JSON.parse(sub.subscription), JSON.stringify(notificationPayload))));
    }
}