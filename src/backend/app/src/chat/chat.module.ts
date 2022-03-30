import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from "./chat.gateway";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { Chat } from "src/orm/entities/chat.entity";
import { Message } from "src/orm/entities/message.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Chat, Message])],
	exports: [ChatService],
	providers: [ChatService, ChatGateway],
	controllers: [ChatController],
})
export class ChatModule {}