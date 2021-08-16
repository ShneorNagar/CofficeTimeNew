import {Controller, Get, Req} from "@nestjs/common";
import {StatsService} from "../services/stats.service";

@Controller('chart')
export class StatsController{

    constructor(private statsService: StatsService) {
    }

    @Get('userData')
    getUserStats(@Req() req){
        const userId = req.query.userId;
        return this.statsService.getUserData(userId);
    }
}