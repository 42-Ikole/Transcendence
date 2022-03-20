import { WebSocketServer, OnGatewayInit, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { movePlayer, newGameState, updateGamestate } from "./pong.game";
import { GameState } from "./pong.types";

let gameState: GameState = newGameState();

@WebSocketGateway({ cors: true, namespace: '/pong' })
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() wss: Server;

	afterInit(server: Server) {
		console.log("Initialized!");
	}
	handleConnection(client: Socket, ...args: any[]) {
		console.log("Connect:", client.id);
		gameState = newGameState();
	}
	handleDisconnect(client: Socket) {
		console.log("Disconnect:", client.id);
	}

	@SubscribeMessage('updatePosition')
	updatePosition(client: Socket, data: any) {
		gameState = updateGamestate(gameState);
		this.wss.emit('updatePosition', gameState);
	}

	@SubscribeMessage('movement')
	movement(client: Socket, data: string) {
		if (data === "w") {
			movePlayer(gameState.playerOne.bar, "ArrowUp");
		} else if (data === "s") {
			movePlayer(gameState.playerOne.bar, "ArrowDown");
		} else if (data === "ArrowDown" || data === "ArrowUp") {
			movePlayer(gameState.playerTwo.bar, data);
		}
		this.wss.emit('updatePosition', gameState);
	}
}
