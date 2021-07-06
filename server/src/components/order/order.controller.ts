import {Body, Controller, Get, Logger, Post} from "@nestjs/common";
import {OrderService} from "./order.service";
import {PushDalService} from "../push/push-dal.service";
import {PushService} from "../push/push.service";
import {HttpResponseService} from "../../services/http/http-response.service";
import {HttpStatusCodeEnum} from "../../services/http/http-status-code.enum";
import {EVENT_TYPE, WebSocketPlasma} from "../../web-socket/event-gateway.app";
import {UserDTO} from "../../shared/user-entity";

@Controller('orders')
export class OrderController {

    constructor(private pushDalService: PushDalService,
                private pushService: PushService,
                private orderService: OrderService,
                private httpResponseService: HttpResponseService,
                private webSocketPlasmaService: WebSocketPlasma) {
    }

    private context = OrderController.name;
    private logger = new Logger(this.context);

    @Post('newOrder')
    async podcastForNewOrder(@Body() user: UserDTO) {
        this.logger.log(`podcastForNewOrder started`, this.context);

        let responseMessage;
        try {
            let newOrderId = await this.orderService.openOrder(user.userId)
            await this.pushService.notifyUsers(user.username, user.userId, newOrderId);

            responseMessage = 'push notification sent successfully';
            this.logger.log(`push notification sent successfully`)
            return this.httpResponseService.buildResponse(responseMessage, HttpStatusCodeEnum.OK);
        } catch (err) {
            this.logger.error(err, this.context);
            return this.httpResponseService.buildCustomErrorResponse(err);
        }
    }

    @Post('response')
    async orderResponse(@Body() body: any) {
        this.logger.log(`orderResponse started. username: ${body.username}`, this.context);
        let responseMessage;
        try {
            await this.orderService.updateUserResponse(body)
            this.webSocketPlasmaService.sendMessage(EVENT_TYPE.RESPONSE, body);
            this.logger.log(`orderResponse ended. username: ${body.username}`, this.context);
            responseMessage = 'thanks! your response will display on the plasma';
            return this.httpResponseService.buildResponse(responseMessage, HttpStatusCodeEnum.CREATED);
        } catch (err) {
            this.logger.error(err, this.context);
            return this.httpResponseService.buildCustomErrorResponse(err);
        }
    }

    @Get('activeOrderDetails')
    async getActiveOrder(){
        this.logger.log(`getActiveOrder started`, this.context);
        try {
            const activeOrder = await this.orderService.getActiveOrderDetails();
            if (activeOrder){
                const message = 'active order details fetched.'
                this.logger.log(message, this.context);
                return this.httpResponseService.buildResponse(message, HttpStatusCodeEnum.OK, activeOrder);
            }
            const message = 'active order details not found.'
            this.logger.log(message, this.context);
            return this.httpResponseService.buildResponse(message);
        } catch (err){
            this.logger.error(err, this.context);
            return this.httpResponseService.buildCustomErrorResponse(err);
        }
    }
}