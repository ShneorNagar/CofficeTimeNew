import {Injectable, Scope} from "@nestjs/common";

@Injectable({scope: Scope.DEFAULT})
export class TimeUtils {

    /**
     * for now we are support for one active order only
     *
     * when app will support groups - we will add multiple orders support
     */
    public getCurrDate(){
        let currDate = new Date();
        const year = currDate.getFullYear();
        const month = currDate.getMonth() + 1;
        const day = currDate.getDate();
        const hour = currDate.getHours();
        const minute = currDate.getMinutes();
        const seconds = currDate.getSeconds();

        return `${hour}:${minute}:${seconds} ${month}/${day}/${year}`
    }

    public isOrderTimeoutPassed(orderTime: string) {
        let time = new Date(orderTime);
        let currTime = new Date(this.getCurrDate());
        let timeDiff = currTime.getTime() - time.getTime();
        let minuteDiff = timeDiff / 1000 / 60;
        return minuteDiff > 3;
    }
}