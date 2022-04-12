import { Injectable, ConflictException } from "@nestjs/common";
import { IncomingMessageDtO, CreateChatInterface, AllChatsDto } from "./chat.types";
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

	async findAllForUser(user: User): Promise<AllChatsDto> {
		console.log("finding rooms for user:", user.username);
		const chats = await this.chatRepository.find({
			relations: ['members'],
		});
		let allChats: AllChatsDto = {joinedChats: [], otherChats: []};
		for (let chat of chats) {
			if (this.userIsInChat(user, chat)) {
				allChats.joinedChats.push(chat);
			} else {
				if (chat.type !== 'private') {
					allChats.otherChats.push(chat);
				}
			}
		}
		return allChats;
	}

	async createChat(param: CreateChatInterface): Promise<Chat> {
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
		// Only let a user join if they're not in the room already.
		if (this.userIsInChat(user, chat)) {
			console.log("User was not added.");
			return ;
		}
		chat.members.push(user);
		await this.chatRepository.save(chat);
		return ;
	}

	async userLeavesRoom(user: User, chat: Chat): Promise<void> {
		// Remove the user from the members list.
		chat.members = chat.members.filter(item => item.id != user.id);
		await this.chatRepository.save(chat);
	}

	userIsInChat(user: User, chat: Chat): Boolean {
		// Look through the members and see if the user is in there.
		for (let member of chat.members) {
			if (member.id === user.id) {
				return true;
			}
		}
		return false;
	}
}
