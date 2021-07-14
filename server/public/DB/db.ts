import * as sqlite3 from 'sqlite-async';
import {Injectable, Logger} from "@nestjs/common";

@Injectable()
export class Sqlite {

    private readonly sqlite;
    private database;
    private context = Sqlite.name;
    private logger = new Logger(this.context);

    get db() {
        return this.database;
    }

    constructor() {
        this.sqlite = sqlite3.open('public/DB/data').then((sqlite) => {

            this.database = sqlite;

            let sql_create_user = `CREATE TABLE IF NOT EXISTS USER 
                                   (user_id VARCHAR PRIMARY KEY, username VARCHAR NOT NULL UNIQUE, password VARCHAR NOT NULL);`;

            let sql_create_user_preferences = `CREATE TABLE IF NOT EXISTS PREFERENCES (coffee INTEGER, tea VARCHAR, sugar INTEGER,
                                        milk VARCHAR, note VARCHAR, drink_type VARCHAR, avatar TEXT, user_id VARCHAR, 
                                        FOREIGN KEY(user_id) REFERENCES user (user_id));`;

            let sql_create_order = `CREATE TABLE IF NOT EXISTS ORDERS (order_id VARCHAR NOT NULL, caller_id VARCHAR NOT NULL, is_order_active INTEGER NOT NULL,
                                                                order_time DATE NOT NULL, PRIMARY KEY("order_id"));`;

            let sql_create_order_response = `CREATE TABLE IF NOT EXISTS ORDERS_RESPONSES (user_id VARCHAR, response_time DATE, response_value VARCHAR, order_id VARCHAR, 
                                                                                          FOREIGN KEY(order_id) REFERENCES ORDERS (order_id));`;

            let sql_create_subscriptions = `CREATE TABLE IF NOT EXISTS SUBSCRIPTIONS (subscription TEXT, username VARCHAR, user_id VARCHAR,
                                            FOREIGN KEY(user_id) REFERENCES user (user_id));`;

            let sql_create_config = `CREATE TABLE IF NOT EXISTS CONFIG (PUSH_PUBLIC_KEY TEXT, PUSH_PRIVATE_KEY TEXT, ORDER_TIMEOUT INTEGER);`;

            this.logger.log('sqlite start to run scripts...', this.context);

            this.logger.log('sqlite: executing sql_create_user', this.context);
            sqlite.run(sql_create_user);

            this.logger.log('sqlite: executing sql_create_user_preferences', this.context);
            sqlite.run(sql_create_user_preferences);

            this.logger.log('sqlite: executing sql_create_order', this.context);
            sqlite.run(sql_create_order);

            this.logger.log('sqlite: executing sql_create_order_response', this.context);
            sqlite.run(sql_create_order_response);

            this.logger.log('sqlite: executing sql_create_subscriptions', this.context);
            sqlite.run(sql_create_subscriptions);

            this.logger.log('sqlite: executing sql_create_config', this.context);
            sqlite.run(sql_create_config);

        })
            .catch((err) => {
                console.error(err);
            });
    }
}