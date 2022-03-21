import { ConfigService } from "@nestjs/config";
import { WebSocketServer, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { SessionUser } from "src/auth/auth.types";
import { UserService } from "src/user/user.service";
import { decodeCookie } from "./cookie";
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
		console.log("Connect:", client.id);
		const user = await this.userFromCookie(client.handshake.headers.cookie);
		console.log("connected:", user);
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
