import { ApiTags, ApiParam } from "@nestjs/swagger";
import { Controller, Get, Post, Body, Param, NotFoundException } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { CreateChatDto } from "./chat.types";
import { Chat } from "src/orm/entities/chat.entity";
import { User } from "src/orm/entities/user.entity";
import { Message } from "src/orm/entities/message.entity";
import { SocketService } from "src/websocket/socket.service";

@ApiTags('chat')
@Controller('chat')
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
		private socketService: SocketService,
	) {}

	@Get()
	async findAll(): Promise<Chat[]> {
		return await this.chatService.findAll();
	}

	@Get('/messages/:name')
	@ApiParam({
		name: 'name',
		required: true,
		description: 'Name of a chatroom',
		type: String,
	})
	async findByName(@Param('name') name: string): Promise<Message[]> {
		const chat: Chat = await this.chatService.findByName(name, ['messages', 'messages.author']);
		if (chat === undefined)
			throw new NotFoundException();
		return chat.messages;
	}

	@Get('/users/:name')
	@ApiParam({
		name: 'name',
		required: true,
		description: 'Name of a chatroom',
		type: String,
	})
	async findUsersForChat(@Param('name') name: string): Promise<User[]> {
		const chat: Chat = await this.chatService.findByName(name, ['members']);
		if (chat === undefined)
			throw new NotFoundException();
		return chat.members;
	}

	@Post()
	async createChat(@Body() body: CreateChatDto): Promise<Chat> {
		const chat: Chat = await this.chatService.createChat(body);
		this.socketService.chatServer.emit('createRoom', {ding: 'saus'});
		console.log('emited naar createRoom');
		return chat;
	}
}
