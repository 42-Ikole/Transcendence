import { WebSocketServer, OnGatewayInit, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, WsResponse } from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	afterInit(server: Server) {
		this.logger.log("Initialized!");
	}
	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log("Connect", client);
		console.log(args);
	}
	handleDisconnect(client: Socket) {
		this.logger.log("Disconnect", client);
	}

	private logger: Logger = new Logger("AppGateway");
	@WebSocketServer() wss: Server;

	@SubscribeMessage('msgToServer')
	handleMessage(client: Socket, data: string): WsResponse<string> {
		console.log("Message:", data);
		this.logger.log(client);
		this.wss.emit('msgToClient', "received data:" + data);
		return { event: 'msgToClient', data };
	}
}
