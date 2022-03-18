import { WebSocketServer, OnGatewayInit, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { updatePos } from "./pong.game";

@WebSocketGateway({ cors: true, namespace: '/pong' })
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() wss: Server;

	afterInit(server: Server) {
		console.log("Initialized!");
	}
	handleConnection(client: Socket, ...args: any[]) {
		console.log("Connect:", client.id);
		client.emit("updatePosition", updatePos());
	}
	handleDisconnect(client: Socket) {
		console.log("Disconnect:", client.id);
	}

	@SubscribeMessage('updatePosition')
	updatePosition(client: Socket, data: any) {
		console.log("Update Position:", data);
		this.wss.emit('updatePosition', updatePos());
	}
}
