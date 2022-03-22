import { UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WebSocketServer, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { SessionUser } from "src/auth/auth.types";
import { UserService } from "src/user/user.service";
import { decodeCookie } from "./cookie";
import { movePlayer, newGameState, updateGamestate } from "./pong.game";
import { GameState } from "./pong.types";
import { WebsocketGuard } from './websocket.guard';
import { SocketWithUser } from "./websocket.types";

let gameState: GameState = newGameState();
let intervalId: NodeJS.Timer;

@WebSocketGateway({
	namespace: '/pong',
	cors: {
		credentials: true,
		origin: ["http://localhost:8080", "http://localhost:3000"],
	},
})
@UseGuards(WebsocketGuard)
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private userService: UserService,
		private configService: ConfigService,
	) {}
	@WebSocketServer() wss: Server;

	private async userFromCookie(cookie: string) {
		const sessionUser: SessionUser = await decodeCookie(cookie, this.configService);
		const user = await this.userService.findOne(sessionUser.id);
		return user;
	}

	async handleConnection(client: Socket, ...args: any[]) {
		const user = await this.userFromCookie(client.handshake.headers.cookie);
		(client as SocketWithUser).user = user;
		console.log("pong WS connected:", user.username);

		gameState = newGameState();
		intervalId = setInterval(() => {
			gameState = updateGamestate(gameState);
			this.wss.emit('updatePosition', gameState);
		}, 15);
	}

	handleDisconnect(client: SocketWithUser) {
		console.log("Disconnect:", client.user.username);
		clearInterval(intervalId);
	}

	@SubscribeMessage('movement')
	movement(client: SocketWithUser, data: string) {
		if (data === "w") {
			movePlayer(gameState.playerOne.bar, "ArrowUp");
		} else if (data === "s") {
			movePlayer(gameState.playerOne.bar, "ArrowDown");
		} else if (data === "ArrowDown" || data === "ArrowUp") {
			movePlayer(gameState.playerTwo.bar, data);
		}
	}
}
