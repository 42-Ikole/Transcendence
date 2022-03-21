import { WebSocketServer, OnGatewayInit, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { movePlayer, newGameState, updateGamestate } from "./pong.game";
import { GameState } from "./pong.types";

let gameState: GameState = newGameState();
let intervalId: NodeJS.Timer;

@WebSocketGateway({
	namespace: '/pong',
	cors: {
		credentials: true,
		origin: ["http://localhost:8080", "http://localhost:3000"],
	},
})
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() wss: Server;
	
	afterInit(server: Server) {
		console.log("Initialized!");
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log("Connect:", client.id);
		console.log(client.handshake);
		gameState = newGameState();
		intervalId = setInterval(() => {
			gameState = updateGamestate(gameState);
			this.wss.emit('updatePosition', gameState);
		}, 15);
	}

	handleDisconnect(client: Socket) {
		console.log("Disconnect:", client.id);
		clearInterval(intervalId);
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
	}
}
