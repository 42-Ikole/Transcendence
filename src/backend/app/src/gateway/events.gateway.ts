import { WebSocketServer, OnGatewayInit, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, WsResponse } from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";

@WebSocketGateway({ cors: true })
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private logger: Logger = new Logger("AppGateway");
	@WebSocketServer() wss: Server;

	afterInit(server: Server) {
		this.logger.log("Initialized!");
	}
	handleConnection(client: Socket, ...args: any[]) {
		console.log("Connect:", client.id);
	}
	handleDisconnect(client: Socket) {
		console.log("Disconnect:", client.id);
	}

	@SubscribeMessage('msgToServer')
	handleMessage(client: Socket, data: string): void {
		this.wss.emit('msgToClient', client.id.toString() + ": " + data);
		// return { event: 'msgToClient', data };
	}
}
