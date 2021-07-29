import {Injectable} from "@nestjs/common";
import {HttpResponse} from "../../shared/user-dto";
import {HttpStatusCodeEnum} from "./http-status-code.enum";

export interface HttpErrorObject {
    message: any,
    httpStatusCode: HttpStatusCodeEnum
}

@Injectable()
export class HttpResponseService {

    buildResponse(message: any, statusCode?: number, value?: any): HttpResponse {
        return {
            message,
            statusCode,
            value
        }
    }

    buildErrorObj(message: any, httpStatusCode: HttpStatusCodeEnum): HttpErrorObject{
        return {
            message, httpStatusCode
        }
    }

    buildCustomErrorResponse(err: any | HttpErrorObject){
        let message = err.message ? err.message : err;
        let statusCode = err.httpStatusCode ? err.httpStatusCode : HttpStatusCodeEnum.INTERNAL_SERVER_ERROR
        return this.buildResponse(message, statusCode);
    }
}