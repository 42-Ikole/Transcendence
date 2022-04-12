import { ApiTags, ApiParam } from "@nestjs/swagger";
import { Controller, Get, Post, Body, Param, NotFoundException, UseGuards, Req } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { CreateChatDto, CreateChatInterface, AllChatsDto } from "./chat.types";
import { Chat } from "src/orm/entities/chat.entity";
import { User } from "src/orm/entities/user.entity";
import { Message } from "src/orm/entities/message.entity";
import { SocketService } from "src/websocket/socket.service";
import { AuthenticatedGuard } from "src/auth/auth.guard";
import { RequestWithUser } from "../auth/auth.types";

@ApiTags('chat')
@Controller('chat')
@UseGuards(AuthenticatedGuard)
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
		private socketService: SocketService,
	) {}

	@Get()
	async findAll(@Req() request: RequestWithUser): Promise<AllChatsDto> {
		// Get all basic information about the chat rooms.

		return await this.chatService.findAll(request.user);
	}

	@Get('/messages/:name')
	@ApiParam({
		name: 'name',
		required: true,
		description: 'Name of a chatroom',
		type: String,
	})
	async findByName(@Param('name') name: string): Promise<Message[]> {
		// Get all the messages for a particular chat.
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
		// Get all the members for a particular chat.
		const chat: Chat = await this.chatService.findByName(name, ['members']);
		if (chat === undefined)
			throw new NotFoundException();
		return chat.members;
	}

	@Post()
	async createChat(@Req() request: RequestWithUser, @Body() body: CreateChatDto): Promise<Chat> {
		// Create an interface from the DTO.
		const createChatInterface: CreateChatInterface = {
			...body,
			owner: request.user,
			members: [request.user],
		};
		// Add the chat to the database.
		const chat: Chat = await this.chatService.createChat(createChatInterface);
		// Broadcast the new room to everyone.
		this.socketService.chatServer.emit('createRoom', {room: chat});
		console.log('Emited createRoom');
		return chat;
	}
}
