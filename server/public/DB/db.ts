import * as sqlite3 from 'sqlite-async';
import {Injectable} from "@nestjs/common";

@Injectable()
export class Sqlite {

    private readonly sqlite;
    private database;

    get db() {
        return this.database;
    }

    constructor() {
        this.sqlite = sqlite3.open('public/DB/data').then((sqlite) => {

            this.database = sqlite;

            console.log('sqlite start to run scripts...')

            let sql_create_user = `CREATE TABLE IF NOT EXISTS USER 
                                   (user_id VARCHAR PRIMARY KEY, username VARCHAR NOT NULL, password VARCHAR NOT NULL);`;

            let sql_create_user_preferences = `CREATE TABLE IF NOT EXISTS PREFERENCES (coffee INTEGER, tea VARCHAR, sugar INTEGER,
                                        milk VARCHAR, note VARCHAR, drink_type VARCHAR, avatar TEXT, user_id VARCHAR, 
                                        FOREIGN KEY(user_id) REFERENCES user (user_id));`;

            let sql_create_order = `CREATE TABLE IF NOT EXISTS ORDERS (order_id VARCHAR NOT NULL, is_order_active INTEGER NOT NULL,
                                                                order_time DATE NOT NULL, PRIMARY KEY("order_id"));`;

            let sql_create_order_response = `CREATE TABLE IF NOT EXISTS ORDERS_RESPONSES (username VARCHAR, response_time DATE, response_value VARCHAR,
                                                                                   owner_order_id VARCHAR,FOREIGN KEY(owner_order_id) REFERENCES ORDERS (order_id));`;

            let sql_create_subscriptions = `CREATE TABLE IF NOT EXISTS SUBSCRIPTIONS (subscription TEXT, username VARCHAR, user_id VARCHAR,
                                            FOREIGN KEY(user_id) REFERENCES user (user_id));`;

            let sql_create_config = `CREATE TABLE IF NOT EXISTS CONFIG (PUSH_PUBLIC_KEY TEXT, PUSH_PRIVATE_KEY TEXT, ORDER_TIMEOUT INTEGER);`;

            console.log('sqlite: executing sql_create_user');
            sqlite.run(sql_create_user);

            console.log('sqlite: executing sql_create_user_preferences');
            sqlite.run(sql_create_user_preferences);

            console.log('sqlite: executing sql_create_order');
            sqlite.run(sql_create_order);

            console.log('sqlite: executing sql_create_order_response');
            sqlite.run(sql_create_order_response);

            console.log('sqlite: executing sql_create_subscriptions');
            sqlite.run(sql_create_subscriptions);

            console.log('sqlite: executing sql_create_config');
            sqlite.run(sql_create_config);

        })
            .catch((err) => {
                console.error(err);
            });
    }
}