import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";

@Module({
	imports: [],
	exports: [],
	providers: [ChatService, ChatGateway],
	controllers: [ChatController],
})
export class ChatModule {}