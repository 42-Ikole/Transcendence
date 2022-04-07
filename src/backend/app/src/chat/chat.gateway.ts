import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer, OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ValidationPipe, UsePipes } from '@nestjs/common';
import { IncomingMessageDtO, JoinRoomDto } from './chat.types';
import { SocketWithUser } from 'src/websocket/websocket.types';
import { CookieService } from 'src/websocket/cookie.service';
import { ChatService } from './chat.service';
import { Message } from 'src/orm/entities/message.entity';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
	cors: {
		origin: ['http://localhost:8080', 'http://localhost:3000'],
		credentials: true,
	},
	namespace: '/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
	constructor(private chatService: ChatService, private cookieService: CookieService) {}
	@WebSocketServer() wss: Server;

	afterInit(server: Server) {
		console.log('chat gateway: OnInit');
	}

	handleDisconnect(client: SocketWithUser) {
		if (!client.user) {
			return ;
		}
		console.log('chat gateway: OnDisconnect');
		console.log('client id:', client.id);
	}

	async handleConnection(client: SocketWithUser) {
		client.user = await this.cookieService.userFromCookie(
			client.handshake.headers.cookie,
		);
		if (!client.user)
		{
			console.log('/chat connection denied:', client.id);
		}
		console.log('chat gateway: OnConnection');
		console.log('client id:', client.id);
	}

	@SubscribeMessage('messageToChat')
	async messageToChat(
		@MessageBody() data: IncomingMessageDtO,
		@ConnectedSocket() client: SocketWithUser
	): Promise<void> {
		const addedMessage: Message = await this.chatService.addMessage(data, client.user);
		this.wss.to(data.chatName).emit('messageToClient', {chatName: data.chatName, message: addedMessage});
		console.log("sent message to room [" + data.chatName + "]");
	}

	@SubscribeMessage('joinRoom')
	joinRoom(
		@MessageBody() data: JoinRoomDto,
		@ConnectedSocket() client: SocketWithUser
	): void {
		client.join(data.roomName);
		console.log("Client [" + client.user.username + "] joined room [" + data.roomName + "]");
	}
}
