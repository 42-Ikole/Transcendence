import { ApiTags, ApiParam } from "@nestjs/swagger";
import { Controller, Get, Post, Body, Param, NotFoundException } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { CreateChatDto } from "./chat.types";
import { Chat } from "src/orm/entities/chat.entity";

@ApiTags('chat')
@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get()
	async findAll(): Promise<Chat[]> {
		return await this.chatService.findAll();
	}

	@Get(':name')
	@ApiParam({
		name: 'name',
		required: true,
		description: 'Name of a chatroom',
		type: String,
	})
	async findByName(@Param('name') name: string): Promise<Chat> {
		const chat: Chat = await this.chatService.findByName(name, true);
		if (chat === undefined)
			throw new NotFoundException();
		return chat;
	}

	@Post()
	async createChat(@Body() body: CreateChatDto): Promise<Chat> {
		return await this.chatService.createChat(body);
	}
}
