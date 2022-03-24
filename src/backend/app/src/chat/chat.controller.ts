import { ApiTags } from "@nestjs/swagger";
import { Controller, Get, Post, Body } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { CreateChatDto } from "./chat.types";

@ApiTags('chat')
@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get()
	async findAll(): Promise<any> {
		return await this.chatService.findAll();
	}

	@Post()
	async makeOne(@Body() body: CreateChatDto): Promise<any> {
		return await this.chatService.makeOne(body);
	}
}
