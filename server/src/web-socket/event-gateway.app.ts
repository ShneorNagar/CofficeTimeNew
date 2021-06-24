import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway, WebSocketServer,
} from "@nestjs/websockets";
import {Server} from 'socket.io'
import {Logger} from "@nestjs/common";

export enum EVENT_TYPE {
    RESPONSE = 'response',
    ORDER = 'order'
}

@WebSocketGateway()
export class WebSocketPlasma implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() wss: Server;

    private context = WebSocketPlasma.name;
    private logger = new Logger(this.context);

    afterInit(server: any): any {
        this.logger.log(`webSocket init`, this.context);
    }

    handleConnection(client: any, ...args: any[]): any {
        this.logger.log(`webSocket connected`, this.context);
        this.sendMessage(EVENT_TYPE.ORDER, 'plasma ws connected');
    }

    handleDisconnect(client: any): any {
        this.logger.warn(`webSocket Disconnect`, this.context);
    }

    sendMessage(eventType: string, data: any) {
        this.logger.debug(`sending sending message. eventType: ${eventType}, data: ${data}`, this.context);
        this.wss.emit(eventType, {userResponse: data});
    }
}