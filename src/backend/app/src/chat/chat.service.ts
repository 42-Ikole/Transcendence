import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { CreateChatDto, IncomingMessageDtO } from "./chat.types";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chat } from "src/orm/entities/chat.entity";
import { Message } from "src/orm/entities/message.entity";
import { User } from "src/orm/entities/user.entity";

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Chat) private chatRepository: Repository<Chat>,
		@InjectRepository(Message) private messageRepository: Repository<Message>,
	) {}

	async findAll(relations = []): Promise<Chat[]> {
		return await this.chatRepository.find({
			relations: relations,
		});
	}

	async findByName(name: string, relations = []): Promise<Chat> {
		console.log("Relations = ", relations);
		return await this.chatRepository.findOne({
			where: [{name: name}],
			relations: relations,
		});
	}

	async createChat(param: CreateChatDto): Promise<Chat> {
		const existingChat = await this.findByName(param.name);
		if (existingChat !== undefined)
			throw new ConflictException();
		const newChat: Chat = this.chatRepository.create(param);
		return await this.chatRepository.save(newChat);
	}

	async addMessage(message: IncomingMessageDtO, user: User): Promise<Message> {
		const messageToDatabase = {
			message: message.message,
			chatRoom: await this.findByName(message.chatName),
			author: user,
		}
		const newMessage: Message = this.messageRepository.create(messageToDatabase);
		return await this.messageRepository.save(newMessage);
	}

	async userJoinsRoom(user: User, chat: Chat): Promise<void> {
		// Alleen pushen als niet al erin.
		if (this.userIsInChat(user, chat)) {
			console.log("User zit al in chat");
			return ;
		}
		chat.members.push(user);
		await this.chatRepository.save(chat);
		return ;
	}

	async userLeavesRoom(user: User, chat: Chat): Promise<void> {
		chat.members = chat.members.filter(item => item.id != user.id);
		await this.chatRepository.save(chat);
	}

	userIsInChat(user: User, chat: Chat): Boolean {
		for (let member of chat.members) {
			if (member.id === user.id) {
				return true;
			}
		}
		return false;
	}
}
