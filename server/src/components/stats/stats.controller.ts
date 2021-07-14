import {Controller, Get, Req} from "@nestjs/common";
import {StatsService} from "./stats.service";

@Controller('chart')
export class StatsController{

    constructor(private statsService: StatsService) {
    }

    @Get('userCupsSum')
    getUserStats(@Req() req){
        const userId = req.query.userId;
        return this.statsService.getAllUserCups(userId);
    }
}