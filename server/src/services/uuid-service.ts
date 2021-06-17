import * as uuid from 'uuid';
import {Injectable} from "@nestjs/common";

@Injectable()
export class UUIDService {

    generateUUID(){
        return uuid.v1().replace(/-/g, "");
    }
}