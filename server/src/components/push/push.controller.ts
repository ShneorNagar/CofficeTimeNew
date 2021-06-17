import {Body, Controller, Post} from "@nestjs/common";
import {UserSubscription} from "../../shared/push-entity";
import {PushDalService} from "./push-dal.service";
import {HttpResponseService} from "../../services/http/http-response.service";
import {HttpStatusCodeEnum} from "../../services/http/http-status-code.enum";

@Controller('push')
export class PushController {

    constructor(private subscriptionsDalService: PushDalService,
                private httpResponseService: HttpResponseService) {
    }

    @Post('newSub')
    async createNewSub(@Body() reqBody: UserSubscription) {
        let resMessage;
        try {
            const userSubscription = await this.subscriptionsDalService.getUserSubscription(reqBody.user.username);

            if (userSubscription){
                resMessage = 'all set... you already registered to push service';
                return this.httpResponseService.buildResponse(resMessage, HttpStatusCodeEnum.OK);
            } else {
                await this.subscriptionsDalService.insertNewSubscription(reqBody.subscription, reqBody.user.username);
                resMessage = 'subscription created';
                return this.httpResponseService.buildResponse(resMessage, HttpStatusCodeEnum.CREATED);
            }
        } catch (err) {
            return this.httpResponseService.buildResponse(err, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR);
        }
    }
}