/**
 * SQL commands repository
 *
 * @param: insert the variables according to the SQL command parameters.
 */

export enum SQL {

    user_getUsername = `SELECT username, user_id FROM USER WHERE username = ?`,

    user_getUser = `SELECT u.username, p.*
                     FROM USER u
                     inner join preferences p on u.user_id = p.user_id
                     where u.username = ?`,

    user_getUserWithPassword = `SELECT u.username, u.user_id, p.*
                                FROM USER u
                                inner join preferences p on u.user_id = p.user_id
                                where u.username = ? and u.password = ?`,

    user_createUser = `INSERT INTO USER VALUES (?, ?, ?)`,

    user_update = `UPDATE USER
                   SET username = ?
                   WHERE user_id = ?`,

    preferences_update = `UPDATE PREFERENCES
                          SET coffee = ?, tea = ?, sugar = ?, milk = ?, note = ?, drink_type = ?, avatar = ?
                          WHERE user_id = ?`,

    preferences_createPreferences = `INSERT INTO preferences (coffee, tea, sugar, milk, note, drink_type, avatar, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,

    subscription_createSubscription = 'INSERT INTO SUBSCRIPTIONS (subscription, username, user_id) VALUES (?, ?, ?)',

    subscription_getByUserId = 'SELECT username FROM SUBSCRIPTIONS WHERE user_id = ?',

    subscription_getOtherSubscriptions = 'SELECT subscription FROM SUBSCRIPTIONS WHERE user_id != ?',

    orders_createNewOrder = 'INSERT INTO ORDERS VALUES (?, ?, ?, ?)',

    orders_deactivateOrder = `UPDATE ORDERS SET is_order_active = 0 WHERE order_id = ?`,

    orders_getActiveOrder = 'SELECT * from orders where is_order_active = 1',

    orders_getOrderById =  'SELECT * FROM ORDERS WHERE order_id = ?',

    orders_getActiveOrderDetails = `SELECT o.order_id, o.order_time, o.caller_id, u.username
                                    from ORDERS o
                                    INNER JOIN USER u on u.user_id = o.caller_id
                                    WHERE o.is_order_active = 1`,

    orders_stats_getAllUserOrdersByUserId = `SELECT u.username, o.order_id, o.order_time as time
                                             FROM ORDERS o
                                             INNER JOIN USER u on u.user_id = o.caller_id
                                             WHERE u.user_id = ?`,

    orders_stats_responses_getOrderResponsesByUserId = `SELECT u.username, o.order_id, o.response_time as time
                                                 FROM ORDERS_RESPONSES o
                                                 INNER JOIN USER u on u.user_id = o.user_id
                                                 WHERE o.response_value = 'accept' AND u.user_id = ?`,

    orders_responses_createNewResponse = 'INSERT INTO ORDERS_RESPONSES VALUES (?, ?, ?, ?)',

    orders_responses_getRespondedUser = `SELECT user_id FROM ORDERS_RESPONSES WHERE user_id = ? AND order_id = ?`,

    orders_responses_getAllResponsesOfOrder = `SELECT r.*
                                               FROM ORDERS_RESPONSES r
                                               INNER JOIN ORDERS o ON r.order_id = ?`
}
