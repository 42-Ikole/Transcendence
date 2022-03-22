import { ApiTags } from "@nestjs/swagger";
import { Controller, Get, Post, Param } from "@nestjs/common";
import { ChatService } from "./chat.service";

@ApiTags('chat')
@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get()
	async findAll(): Promise<any> {
		return await this.chatService.findAll();
	}

	@Post()
	async makeOne(@Param() params): Promise<any> {
		return await this.chatService.makeOne(params);
	}
}