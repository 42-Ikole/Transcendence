import { UseGuards, UsePipes, ValidationPipe, UseFilters } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WebSocketServer, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, ConnectedSocket, MessageBody } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { SessionUser } from "src/auth/auth.types";
import { UserService } from "src/user/user.service";
import { decodeCookie } from "./cookie";
import { movePlayer, newGameState, updateGamestate } from "./pong.game";
import { GameState } from "./pong.types";
import { WebsocketGuard } from './websocket.guard';
import { RequestMatchDto, SocketWithUser } from "./websocket.types";
import { WsExceptionFilter } from "./websocket.exception.filter";

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
@UseFilters(WsExceptionFilter)
@UsePipes(new ValidationPipe())
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

	async handleConnection(client: SocketWithUser) {
		client.user = null;
		const user = await this.userFromCookie(client.handshake.headers.cookie);
		client.user = user;
		console.log("/pong Connect:", client.user.username);
	}

	handleDisconnect(client: SocketWithUser) {
		console.log("/pong Disconnect:", client.user.username);
	}

	/*
	Data:
		TYPE: "matchmaking" | "challenge"
		TARGET: "_user_id_" | null
	*/
	@SubscribeMessage('requestMatch')
	requestMatch(@ConnectedSocket() client: SocketWithUser, @MessageBody() data: RequestMatchDto) {
		console.log("Request Match data:", data);
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
