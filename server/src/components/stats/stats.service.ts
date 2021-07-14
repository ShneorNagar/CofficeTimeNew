import {Injectable, Logger} from "@nestjs/common";
import {StatsDalService} from "./stats-dal.service";
import {HttpStatusCodeEnum} from "../../services/http/http-status-code.enum";
import {HttpResponseService} from "../../services/http/http-response.service";

@Injectable()
export class StatsService {

    constructor(private statsDalService: StatsDalService,
                private httpResponseService: HttpResponseService) {
    }

    private context = StatsService.name;
    private logger = new Logger(this.context);

    private buildArrayFromDBObject(object) {
        let objectsArray = [];
        Object.keys(object).forEach(key => {
            objectsArray.push(object[key]);
        })
        return objectsArray;
    }

    async getAllUserCups(userId: string) {
        try {
            const ordersCalls = this.buildArrayFromDBObject(await this.statsDalService.getUserOrderCalls(userId));
            const ordersAccepts = this.buildArrayFromDBObject(await this.statsDalService.getOrderAccepts(userId));
            const allCups = {ordersCalls, ordersAccepts}
            return this.httpResponseService.buildResponse('user cups fetched.', HttpStatusCodeEnum.OK, allCups);
        } catch (err) {
            const message = 'error while fetching data.';
            this.logger.log(err, this.context)
            return Promise.reject(this.httpResponseService.buildErrorObj(message, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR));
        }
    }

}