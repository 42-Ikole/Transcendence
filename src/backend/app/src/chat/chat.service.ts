import { Injectable } from "@nestjs/common";
import { CreateChatDto } from "./chat.types";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chat } from "src/orm/entities/chat.entity";
import { Message } from "src/orm/entities/message.entity";

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Chat) private chatRepository: Repository<Chat>,
		@InjectRepository(Message) private messageRepository: Repository<Message>,
	) {}

	async findAll(): Promise<Chat[]> {
		return this.chatRepository.find();
	}

	async createChat(param: CreateChatDto): Promise<Chat> {
		console.log("type", param.type);
		console.log("name", param.name);
		console.log("password", param.password);

		const newChat: Chat = this.chatRepository.create(param);
		return this.chatRepository.save(newChat);
	}
}
