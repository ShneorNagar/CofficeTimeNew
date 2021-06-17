import {Injectable, Scope} from "@nestjs/common";
import {Subject} from "rxjs";

@Injectable({scope: Scope.DEFAULT})
export class OrderUtils{

    /**
     * for now we are support for one active order only
     *
     * when app will support groups - we will add multiple orders support
     */
    public orderStatusSubject = new Subject<number>();

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
}