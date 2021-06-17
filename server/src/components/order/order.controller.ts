import {Body, Controller, Post} from "@nestjs/common";
import {OrderService} from "./order.service";
import {PushDalService} from "../push/push-dal.service";
import {PushService} from "../push/push.service";
import {HttpResponseService} from "../../services/http/http-response.service";
import {HttpStatusCodeEnum} from "../../services/http/http-status-code.enum";
import {EVENT_TYPE, WebSocketPlasma} from "../../web-socket/event-gateway.app";

@Controller('orders')
export class OrderController {

    constructor(private pushDalService: PushDalService,
                private pushService: PushService,
                private orderService: OrderService,
                private httpResponseService: HttpResponseService,
                private webSocketPlasmaService: WebSocketPlasma) {
    }

    @Post('newOrder')
    async podcastForNewOrder(@Body() body: { username: string }) {
        let responseMessage;
        try {
            let newOrderId = await this.orderService.openOrder()
            await this.pushService.notifyUsers(body.username, newOrderId);

            responseMessage = 'push notification sent successfully';
            return this.httpResponseService.buildResponse(responseMessage, HttpStatusCodeEnum.OK);
        } catch (err) {
            return this.httpResponseService.buildCustomErrorResponse(err);
        }
    }

    @Post('response')
    async orderResponse(@Body() body: any) {
        let responseMessage;
        try {
            await this.orderService.updateUserResponse(body)

            this.webSocketPlasmaService.sendMessage(EVENT_TYPE.RESPONSE, body);
            responseMessage = 'thanks! your response will display on the plasma';
            return this.httpResponseService.buildResponse(responseMessage, HttpStatusCodeEnum.CREATED);
        } catch (err) {
            return this.httpResponseService.buildCustomErrorResponse(err);
        }
    }
}