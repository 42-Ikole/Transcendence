import { ApiTags } from "@nestjs/swagger";
import { Controller, Get, Post, Body } from "@nestjs/common";
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

	@Post()
	async createChat(@Body() body: CreateChatDto): Promise<Chat> {
		return await this.chatService.createChat(body);
	}
}
