import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer, OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ValidationPipe, UsePipes } from '@nestjs/common';
import { IncomingMessageDtO, ChatRoomDto, AllChatsDto } from './chat.types';
import { SocketWithUser } from 'src/websocket/websocket.types';
import { CookieService } from 'src/websocket/cookie.service';
import { ChatService } from './chat.service';
import { Message } from 'src/orm/entities/message.entity';
import { Chat } from 'src/orm/entities/chat.entity';
import { SocketService } from 'src/websocket/socket.service';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
	cors: {
		origin: ['http://localhost:8080', 'http://localhost:3000'],
		credentials: true,
	},
	namespace: '/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
	constructor(
		private chatService: ChatService,
		private cookieService: CookieService,
		private socketService: SocketService,
	) {}
	@WebSocketServer() wss: Server;

	afterInit(server: Server) {
		this.socketService.chatServer = server;
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
			client.disconnect();
			return ;
		}
		console.log('chat gateway: OnConnection');
		console.log('client id:', client.id);
		const chats: AllChatsDto = await this.chatService.findAll(client.user);
		for (let chat of chats.joinedChats) {
			client.join(chat.name);
		}
	}

	@SubscribeMessage('messageToChat')
	async messageToChat(
		@MessageBody() data: IncomingMessageDtO,
		@ConnectedSocket() client: SocketWithUser
	): Promise<void> {
		// Verify if user is in this room.
		const chat: Chat = await this.chatService.findByName(data.chatName, ["members"]);
		for (let member of chat.members) {
			if (member.id === client.user.id) {
				const addedMessage: Message = await this.chatService.addMessage(data, client.user);
				this.wss.to(chat.name).emit('messageToClient', {chatName: chat.name, message: addedMessage});
				console.log("sent message to room [" + chat.name + "]");
				return ;
			}
		}
	}

	@SubscribeMessage('joinRoom')
	async joinRoom(
		@MessageBody() data: ChatRoomDto,
		@ConnectedSocket() client: SocketWithUser
	): Promise<void> {
		// If user is already in the room, skip password check

		// Verify password
		const success: boolean = await this.chatService.matchPassword(data.roomName, data.password);
		const chat: Chat = await this.chatService.findByName(data.roomName, ['members']);
		if (this.chatService.userIsInChat(client.user, chat)) {
			client.emit('joinRoomSuccess');
			return ;
		}
		if (!success || chat === undefined) {
			client.emit('joinRoomFailure');
			return ;
		}
		this.chatService.userJoinsRoom(client.user, chat);
		client.emit('joinRoomSuccess');
		this.wss.to(chat.name).emit('userJoinedRoom', {chatName: chat.name, user: client.user});
	}

	@SubscribeMessage('leaveRoom')
	async leaveRoom(
		@MessageBody() data: ChatRoomDto,
		@ConnectedSocket() client: SocketWithUser
	): Promise<void> {
		const chat: Chat = await this.chatService.findByName(data.roomName, ['members']);
		if (chat === undefined || !this.chatService.userIsInChat(client.user, chat)) {
			client.emit('leaveRoomSuccess');
			return ;
		}
		client.leave(data.roomName);
		await this.chatService.userLeavesRoom(client.user, chat);
		client.emit('leaveRoomSuccess');
		this.wss.to(chat.name).emit('userLeftRoom', {chatName: chat.name, user: client.user});
	}

	@SubscribeMessage('requestMessages')
	async requestMessages(
		@MessageBody() data: ChatRoomDto,
		@ConnectedSocket() client: SocketWithUser
	): Promise<void> {
		const chat: Chat = await this.chatService.findByName(data.roomName, ['members']);
		if (chat === undefined) {
			client.emit('requestMessageFailure');
			return ;
		}
		if (this.chatService.userIsInChat(client.user, chat)) {
			client.join(chat.name);
			client.emit('requestMessageSuccess');
		} else {
			client.emit('requestMessageFailure');
		}
	}
}
