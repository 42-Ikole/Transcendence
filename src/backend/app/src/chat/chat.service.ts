import {
  Injectable,
  ConflictException,
  NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import {
  IncomingMessageDtO,
  CreateChatInterface,
  AllChatsDto,
} from './chat.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from 'src/orm/entities/chat.entity';
import { Message } from 'src/orm/entities/message.entity';
import { User } from 'src/orm/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async findAll(user: User): Promise<AllChatsDto> {
    console.log('finding rooms for user:', user.username);
    const chats = await this.chatRepository.find({
      relations: ['members'],
    });
    const allChats: AllChatsDto = { joinedChats: [], otherChats: [] };
    for (const chat of chats) {
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

  async matchPassword(roomName: string, password: string): Promise<boolean> {
    const chat = await this.chatRepository.findOne({
      select: ['password', 'type'],
      where: [{ name: roomName }],
    });
    if (chat === undefined) {
      throw new NotFoundException();
    }
    if (chat.type !== 'protected') {
      return true;
    }
    return chat.password === password;
  }

  async findByName(name: string, relations = []): Promise<Chat> {
    console.log('Relations = ', relations);
    return await this.chatRepository.findOne({
      where: [{ name: name }],
      relations: relations,
    });
  }

  async createChat(param: CreateChatInterface): Promise<Chat> {
    const existingChat = await this.findByName(param.name);
    if (existingChat !== undefined) throw new ConflictException();
    const newChat: Chat = this.chatRepository.create(param);
    return await this.chatRepository.save(newChat);
  }

  async addMessage(message: IncomingMessageDtO, user: User): Promise<Message> {
    const messageToDatabase = {
      message: message.message,
      chatRoom: await this.findByName(message.chatName),
      author: user,
    };
    const newMessage: Message =
      this.messageRepository.create(messageToDatabase);
    return await this.messageRepository.save(newMessage);
  }

  async userJoinsRoom(user: User, chat: Chat): Promise<void> {
    // Only let a user join if they're not in the room already.
    if (this.userIsInChat(user, chat)) {
      console.log('User was not added.');
      return;
    }
    chat.members.push(user);
    await this.chatRepository.save(chat);
    return;
  }

  async userLeavesRoom(user: User, chat: Chat): Promise<void> {
    // Remove the user from the members list.
    chat.members = chat.members.filter((item) => item.id != user.id);
    await this.chatRepository.save(chat);
    return;
  }

  async promoteAdmin(
    requestingUser: User,
    user: User,
    chat: Chat,
  ): Promise<boolean> {
    // Check if requesting user is owner.
    if (!this.userIsOwner(requestingUser, chat)) {
      throw new UnauthorizedException();
    }
    // Only add admin role if not already admin, or owner.
    if (
      this.userIsOwner(user, chat) ||
      this.userHasAdminPrivilege(user, chat)
    ) {
      return false;
    }
    chat.admins.push(user);
    await this.chatRepository.save(chat);
    return true;
  }

  async demoteAdmin(
    requestingUser: User,
    user: User,
    chat: Chat,
  ): Promise<boolean> {
    // Check if requesting user is owner.
    if (!this.userIsOwner(requestingUser, chat)) {
      return;
    }
    // Remove the user from the admins list.
    chat.admins = chat.admins.filter((item) => item.id != user.id);
    await this.chatRepository.save(chat);
    return;
  }

  async changeRoomOwner(
    requestingUser: User,
    newOwner: User,
    chat: Chat,
  ): Promise<boolean> {
    // Check if requesting user is owner.
    if (!this.userIsOwner(requestingUser, chat)) {
      return;
    }
    chat.owner = newOwner;
    await this.chatRepository.save(chat);
    return;
  }

  userIsInChat(user: User, chat: Chat): boolean {
    // Look through the members and see if the user is in there.
    for (const member of chat.members) {
      if (member.id === user.id) {
        return true;
      }
    }
    return false;
  }

  userIsOwner(user: User, chat: Chat): boolean {
    return chat.owner.id === user.id;
  }

  userHasAdminPrivilege(user: User, chat: Chat): boolean {
    if (chat.owner.id === user.id) {
      return true;
    }
    for (const admin of chat.admins) {
      if (admin.id === user.id) {
        return true;
      }
    }
    return false;
  }

  isValidRoomname(name: string): boolean {
		const len = name.length;
		if (len > 32) {
			return false;
		}
    for (let i = 0; i < len; i++) {
      const char = name.charCodeAt(i);
      if (
        !(char > 47 && char < 58) &&
        !(char > 64 && char < 91) &&
        !(char > 96 && char < 123) &&
        !(char == 95)
      ) {
        return false;
      }
      if (i == 0 && char == 95) {
        return false;
      }
    }
    return true;
  }
}
