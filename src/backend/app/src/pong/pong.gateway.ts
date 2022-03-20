import { WebSocketServer, OnGatewayInit, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { resetGameState, updateGamestate } from "./pong.game";
import { GameState } from "./pong.types";

let gameState: GameState;

@WebSocketGateway({ cors: true, namespace: '/pong' })
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() wss: Server;

	afterInit(server: Server) {
		console.log("Initialized!");
		resetGameState(gameState);
	}
	handleConnection(client: Socket, ...args: any[]) {
		console.log("Connect:", client.id);
		// client.emit("updatePosition", updatePos());
	}
	handleDisconnect(client: Socket) {
		console.log("Disconnect:", client.id);
	}

	@SubscribeMessage('updatePosition')
	updatePosition(client: Socket, data: any) {
		console.log("Update Position:", data);
		this.wss.emit('updaePosition', updateGamestate(gameState));
		// this.wss.emit('updatePosition', updatePos());
	}
}
