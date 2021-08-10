import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserRepository} from "./repositories/user.repository";
import {UsersController} from "../controllers/users.controller";
import {HttpResponseService} from "../services/http/http-response.service";
import {SubscriptionRepository} from "./repositories/subscription.repository";
import {UserEntity} from "./entities/user.entity";
import {PreferencesEntity} from "./entities/preferences.entity";
import {SubscriptionEntity} from "./entities/subscription.entity";
import {OrderEntity} from "./entities/order.entity";
import {OrderResponseEntity} from "./entities/order-response.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, PreferencesEntity, SubscriptionEntity, OrderEntity, OrderResponseEntity])],
    providers: [UserRepository, SubscriptionRepository, HttpResponseService],
    controllers: [UsersController],
    exports: [UserRepository, SubscriptionRepository]
})
export class OrmModule {}