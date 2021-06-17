import {Injectable} from "@nestjs/common";
import * as WebSocket from 'ws';

@Injectable()
export class WebSocketService {

    wss = new WebSocket.Server()
}