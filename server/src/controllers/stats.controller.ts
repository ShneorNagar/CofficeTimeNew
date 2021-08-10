import {Controller, Get, Req} from "@nestjs/common";
import {StatsService} from "../components/stats/stats.service";

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