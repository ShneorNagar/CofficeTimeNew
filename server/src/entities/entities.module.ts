import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./user/user.entity";
import {UserService} from "./user/user.service";
import {UsersController} from "../components/users/users.controller";
import {HttpResponseService} from "../services/http/http-response.service";
import {PreferencesEntity} from "./preferences/preferences.entity";
import {SubscriptionEntity} from "./subscription/subscription.entity";
import {OrdersEntity} from "./orders/orders.entity";
import {OrderResponseEntity} from "./order-response/order-response.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, PreferencesEntity, SubscriptionEntity, OrdersEntity, OrderResponseEntity])],
    providers: [UserService, HttpResponseService],
    controllers: [UsersController],
    exports: [UserService]
})
export class EntitiesModule{}
