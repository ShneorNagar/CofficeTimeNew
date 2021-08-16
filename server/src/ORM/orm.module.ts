import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserRepository} from "./repositories/user.repository";
import {UsersController} from "../controllers/users.controller";
import {HttpResponseService} from "../utils/http-response.service";
import {SubscriptionRepository} from "./repositories/subscription.repository";
import {UserEntity} from "./entities/user.entity";
import {PreferencesEntity} from "./entities/preferences.entity";
import {SubscriptionEntity} from "./entities/subscription.entity";
import {OrderEntity} from "./entities/order.entity";
import {OrderResponseEntity} from "./entities/order-response.entity";
import {TimeUtils} from "../utils/time.utils";
import {OrderService} from "../services/order.service";
import {OrdersRepository} from "./repositories/orders.repository";
import {OrderResponseRepository} from "./repositories/order-response.repository";
import {StatsRepository} from "./repositories/stats.repository";
import {PushController} from "../controllers/push.controller";
import {OrderController} from "../controllers/order.controller";
import {ConfigController} from "../controllers/config.controller";
import {StatsController} from "../controllers/stats.controller";
import {PushService} from "../services/push.service";
import {WebSocketPlasma} from "../web-socket/event-gateway.app";
import {StatsService} from "../services/stats.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, PreferencesEntity, SubscriptionEntity, OrderEntity, OrderResponseEntity])],
    providers: [
        WebSocketPlasma,
        PushService,
        HttpResponseService,
        StatsService,
        TimeUtils,
        OrderService,
        OrdersRepository,
        OrderResponseRepository,
        UserRepository,
        StatsRepository,
        SubscriptionRepository
    ],
    controllers: [
        UsersController,
        PushController,
        OrderController,
        ConfigController,
        StatsController
    ],
    exports: [
        HttpResponseService,
        TimeUtils,
        OrderService,
        OrdersRepository,
        OrderResponseRepository,
        UserRepository,
        StatsRepository,
        SubscriptionRepository
    ]
})
export class OrmModule {
}