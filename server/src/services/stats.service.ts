import {Injectable, Logger} from "@nestjs/common";
import {HttpStatusCodeEnum} from "../consts/http-status-code.enum";
import {HttpResponseService} from "../utils/http-response.service";
import {StatsRepository} from "../ORM/repositories/stats.repository";

@Injectable()
export class StatsService {

    constructor(private httpResponseService: HttpResponseService,
                private statsRepository: StatsRepository) {
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

    async getUserData(userId: string) {
        try {
            const ordersCalls = this.buildArrayFromDBObject(await this.statsRepository.getUserOrderCalls(userId));
            const ordersAccepts = this.buildArrayFromDBObject(await this.statsRepository.getOrderAccepts(userId));
            const allCups = {ordersCalls, ordersAccepts}
            return this.httpResponseService.buildResponse('user cups fetched.', HttpStatusCodeEnum.OK, allCups);
        } catch (err) {
            const message = 'error while fetching data.';
            this.logger.log(err, this.context)
            return Promise.reject(this.httpResponseService.buildErrorObj(message, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR));
        }
    }

}