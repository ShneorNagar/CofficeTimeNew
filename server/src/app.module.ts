import {Module} from '@nestjs/common';
import {UsersDalService} from "./components/users/users-dal.service";
import {PushDalService} from "./components/push/push-dal.service";
import {PushService} from "./components/push/push.service";
import {Sqlite} from "../public/DB/db";
import {WebSocketPlasma} from "./web-socket/event-gateway.app";
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
        OrmModule,
    ],
    controllers: [],
    providers: [UsersDalService,
        PushDalService,
        PushService,
        Sqlite,
        WebSocketPlasma,
        StatsDalService,
        StatsService],
})
export class AppModule {
}
