import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserService} from "./services/user.service";
import {UsersController} from "../components/users/users.controller";
import {HttpResponseService} from "../services/http/http-response.service";
import {SubscriptionService} from "./services/subscription.service";
import {UserEntity} from "./entities/user.entity";
import {PreferencesEntity} from "./entities/preferences.entity";
import {SubscriptionEntity} from "./entities/subscription.entity";
import {OrdersEntity} from "./entities/orders.entity";
import {OrderResponseEntity} from "./entities/order-response.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, PreferencesEntity, SubscriptionEntity, OrdersEntity, OrderResponseEntity])],
    providers: [UserService, SubscriptionService, HttpResponseService],
    controllers: [UsersController],
    exports: [UserService, SubscriptionService]
})
export class OrmModule {}