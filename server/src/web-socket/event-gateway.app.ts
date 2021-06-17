import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway, WebSocketServer,
} from "@nestjs/websockets";
import {Server} from 'socket.io'

export enum EVENT_TYPE {
    RESPONSE = 'response',
    ORDER = 'order'
}

@WebSocketGateway()
export class WebSocketPlasma implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

    constructor() {
    }

    @WebSocketServer() wss: Server;

    afterInit(server: any): any {
        console.log(`webSocket init`);
    }

    handleConnection(client: any, ...args: any[]): any {
        console.log(`webSocket connected!`);
        this.sendMessage(EVENT_TYPE.ORDER, 'plasma ws connected');
    }

    handleDisconnect(client: any): any {
        console.log(`webSocket Disconnect...`);
    }

    sendMessage(eventType: string, data: any) {
        this.wss.emit(eventType, { userResponse: data });
    }

}