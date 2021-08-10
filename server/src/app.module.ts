import {Module} from '@nestjs/common';
import {UsersController} from "./controllers/users.controller";
import {UsersDalService} from "./components/users/users-dal.service";
import {PushController} from "./controllers/push.controller";
import {PushDalService} from "./components/push/push-dal.service";
import {PushService} from "./components/push/push.service";
import {OrderService} from "./components/order/order.service";
import {OrderDalService} from "./components/order/order-dal.service";
import {OrderUtils} from "./components/order/order.utils";
import {OrderController} from "./controllers/order.controller";
import {Sqlite} from "../public/DB/db";
import {HttpResponseService} from "./services/http/http-response.service";
import {UUIDService} from "./services/uuid-service";
import {WebSocketPlasma} from "./web-socket/event-gateway.app";
import {ConfigController} from "./config/config.controller";
import {StatsController} from "./controllers/stats.controller";
import {StatsDalService} from "./components/stats/stats-dal.service";
import {StatsService} from "./components/stats/stats.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OrmModule} from "./ORM/orm.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'public/DB/database',
            synchronize: true,
            logging: 'all',
            // dropSchema: true, // todo false
            entities: [__dirname + '/ORM/entities/*.entity{.ts,.js}']
        }),
        OrmModule
    ],
    controllers: [
        UsersController,
        PushController,
        OrderController,
        ConfigController,
        StatsController],
    providers: [UsersDalService,
        PushDalService,
        PushService,
        OrderService,
        OrderDalService,
        OrderUtils,
        Sqlite,
        UUIDService,
        HttpResponseService,
        WebSocketPlasma,
        StatsDalService,
        StatsService],
})
export class AppModule {
}
