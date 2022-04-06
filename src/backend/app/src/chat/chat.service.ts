import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { CreateChatDto, IncomingMessageDtO } from "./chat.types";
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
		return await this.chatRepository.find();
	}

	async findByName(name: string): Promise<Chat> {
		return await this.chatRepository.findOne({
			where: [{name: name}],
		})
	}

	async findMessagesForChat(chatName: string): Promise<Message[]> {
		const chat: Chat = await this.findByName(chatName);
		if (chat === undefined)
			throw new NotFoundException();
		return await this.messageRepository.find({
			where: [{chatRoom: chat}],
		})
	}

	async createChat(param: CreateChatDto): Promise<Chat> {
		const existingChat = await this.findByName(param.name);
		if (existingChat !== undefined)
			throw new ConflictException();
		const newChat: Chat = this.chatRepository.create(param);
		return await this.chatRepository.save(newChat);
	}

	async addMessage(message: IncomingMessageDtO): Promise<Message> {
		const newMessage: Message = this.messageRepository.create(message);
		return await this.messageRepository.save(newMessage);
	}
}
