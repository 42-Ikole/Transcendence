import { WebSocketServer, OnGatewayInit, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, WsResponse } from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { IsString } from "class-validator";

class MessageDto {
	@IsString()
	message: string;
	@IsString()
	room: string;
};

@WebSocketGateway({ cors: true, namespace: '/chat' })
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
	handleMessage(client: Socket, data: MessageDto): void {
		console.log("recv:", data);
		this.wss.to(data.room).emit('msgToClient', data.message);
	}

	@SubscribeMessage('joinRoom')
	joinRoom(client: Socket, room: string) {
		client.join(room);
		client.emit('status', "Joined");
	}

	@SubscribeMessage('leaveRoom')
	leaveRoom(client: Socket, room: string) {
		client.leave(room);
		client.emit('status', "Left");
	}
}
