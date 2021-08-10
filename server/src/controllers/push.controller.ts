import {Body, Controller, Logger, Post} from "@nestjs/common";
import {UserSubscription} from "../shared/push-entity";
import {PushDalService} from "../components/push/push-dal.service";
import {HttpResponseService} from "../services/http/http-response.service";
import {HttpStatusCodeEnum} from "../services/http/http-status-code.enum";

@Controller('push')
export class PushController {

    constructor(private subscriptionsDalService: PushDalService,
                private httpResponseService: HttpResponseService) {
    }

    private context = PushController.name;
    private logger = new Logger(this.context);

    @Post('newSub')
    async createNewSub(@Body() reqBody: UserSubscription) {
        this.logger.log(`createNewSub started`, this.context);
        let resMessage;
        try {
            const userSubscription = await this.subscriptionsDalService.getUserSubscription(reqBody.user.userId);
            if (userSubscription){
                this.logger.log(`user have subscription already. userId: ${reqBody.user.userId}`, this.context);
                resMessage = 'all set... you already registered to push service';
                return this.httpResponseService.buildResponse(resMessage, HttpStatusCodeEnum.OK);
            } else {
                await this.subscriptionsDalService.insertNewSubscription(reqBody.subscription, reqBody.user.username, reqBody.user.userId);
                resMessage = 'subscription created';
                this.logger.log(`${resMessage} userId: ${reqBody.user.userId}`, this.context);
                return this.httpResponseService.buildResponse(resMessage, HttpStatusCodeEnum.CREATED);
            }
        } catch (err) {
            this.logger.error(err, this.context);
            return this.httpResponseService.buildResponse(err, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR);
        }
    }
}