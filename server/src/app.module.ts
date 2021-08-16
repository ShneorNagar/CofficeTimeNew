import {Module} from '@nestjs/common';
import {PushService} from "./services/push.service";
import {WebSocketPlasma} from "./web-socket/event-gateway.app";
import {StatsService} from "./services/stats.service";
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
    providers: [
        PushService,
        WebSocketPlasma,
        StatsService],
})
export class AppModule {
}
