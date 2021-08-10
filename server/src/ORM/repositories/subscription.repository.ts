import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {SubscriptionEntity} from "../entities/subscription.entity";
import {Not, Repository} from "typeorm";

@Injectable()
export class SubscriptionRepository {

    constructor(@InjectRepository(SubscriptionEntity)
                private readonly subscriptionRepository: Repository<SubscriptionEntity>) {
    }

    async getUserSubscription(userId: string) {
        return this.subscriptionRepository.find({where: {userId}});
    }

    async insertNewSubscription(subscription: any, userId: string) {
        const subscriptionStr = JSON.stringify(subscription);
        return this.subscriptionRepository
            .createQueryBuilder('subscriptions')
            .insert()
            .into(SubscriptionEntity)
            .values([
                {subscription: subscriptionStr, userId}
            ])
            .execute();
    }

    async getGroupSubscriptions(userId: string) {
        return this.subscriptionRepository.find({where: {userId: Not(userId)}});
    }
}