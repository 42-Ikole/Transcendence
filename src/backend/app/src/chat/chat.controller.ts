import { ApiTags, ApiParam } from "@nestjs/swagger";
import { Controller, Get, Post, Body, Param } from "@nestjs/common";
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
	async findByName(@Param() name: string): Promise<Chat> {
		return await this.chatService.findByName(name, true);
	}

	@Post()
	async createChat(@Body() body: CreateChatDto): Promise<Chat> {
		return await this.chatService.createChat(body);
	}
}
