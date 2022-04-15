import {
  Injectable,
  ConflictException,
  NotFoundException,
	UnauthorizedException,
	ImATeapotException,
	NotAcceptableException,
} from '@nestjs/common';
import {
  IncomingMessageDtO,
  CreateChatInterface,
  AllChatsDto,
	ChatRoleUpdateInterface,
} from './chat.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from 'src/orm/entities/chat.entity';
import { Message } from 'src/orm/entities/message.entity';
import { User } from 'src/orm/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { SocketService } from 'src/websocket/socket.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
		@InjectRepository(Message) private messageRepository: Repository<Message>,
		private userService: UserService,
		private socketService: SocketService,
  ) {}

  async findAll(user: User): Promise<AllChatsDto> {
		// Find all members and owner of all the rooms.
    const chats = await this.chatRepository.find({
      relations: ['members', 'owner'],
		});
		// Put the chatrooms into the interface to send it back to the frontend.
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

	async findById(id: number, relations = []): Promise<Chat> {
		return await this.chatRepository.findOne({
			where: [{id: id}],
			relations: relations,
		});
	}

  async createChat(param: CreateChatInterface): Promise<Chat> {
		// Check if the password has been set if the type is protected.
		if (param.type == 'protected' && param.password === '') {
			throw new ImATeapotException();
		}
		// Check if the roomname is valid.
    if (!this.isValidRoomname(param.name)) {
      throw new NotAcceptableException();
		}
		// Check if the chat does not already exist.
    const existingChat = await this.findByName(param.name);
    if (existingChat !== undefined) {
			throw new ConflictException();
		}
		// Create the new chat from the parameters.
    const chat: Chat = this.chatRepository.create(param);
		await this.chatRepository.save(chat);
		// Broadcast that a new room has been created.
		this.socketService.chatServer.emit('createRoom', {room: chat});
		return chat;
	}

	async deleteChat(requestingUser: User, chatId: number): Promise<Chat> {
		// Get the chat.
		const chat: Chat = await this.findById(chatId, ['owner']);
		// Check if the user who requested the delete owns this chat.
		if (!this.userIsOwner(requestingUser, chat)) {
			throw new UnauthorizedException();
		}
		// Remove the chat.
		return this.chatRepository.remove(chat);
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
    chatId: number,
    userId: number,
  ): Promise<ChatRoleUpdateInterface> {
		// Get the chat.
		const chat: Chat = await this.findById(chatId, ['admins', 'owner']);
		if (chat === undefined) {
			throw new NotFoundException();
		}
		// Check if requesting user is owner.
		if (!this.userIsOwner(requestingUser, chat)) {
			throw new UnauthorizedException();
		}
		// Now get the user to which this promotion applies.
		const user: User = await this.userService.findById(userId);
		if (user === undefined) {
			throw new NotFoundException();
		}
    // Only add admin role if not already admin, or owner.
    if (this.userHasAdminPrivilege(user, chat)) {
      return {success: false, chatName: chat.name};
    }
    chat.admins.push(user);
    await this.chatRepository.save(chat);
    return {success: true, chatName: chat.name};
  }

  async demoteAdmin(
    requestingUser: User,
    chatId: number,
    userId: number,
  ): Promise<ChatRoleUpdateInterface> {
		// Get the chat.
		const chat: Chat = await this.findById(chatId, ['admins', 'owner']);
		if (chat === undefined) {
			throw new NotFoundException();
		}
    // Check if requesting user is owner.
    if (!this.userIsOwner(requestingUser, chat)) {
      throw new UnauthorizedException();
		}
		// Now get the user to which this demotion applies.
		const user: User = await this.userService.findById(userId);
		if (user === undefined) {
			throw new NotFoundException();
		}
    // Remove the user from the admins list.
    chat.admins = chat.admins.filter((item) => item.id != user.id);
    await this.chatRepository.save(chat);
    return {success: true, chatName: chat.name};
  }

  async changeRoomOwner(
    requestingUser: User,
    chatId: number,
    userId: number,
  ): Promise<ChatRoleUpdateInterface> {
		// Get the chat.
		const chat: Chat = await this.findById(chatId, ['admins', 'owner']);
		if (chat === undefined) {
			throw new NotFoundException();
		}
    // Check if requesting user is owner.
    if (!this.userIsOwner(requestingUser, chat)) {
      throw new UnauthorizedException();
		}
		// Now get the user who will become the new owner.
		const user: User = await this.userService.findById(userId);
		if (user === undefined) {
			throw new NotFoundException();
		}
		chat.owner = user;
		chat.admins = chat.admins.filter((item) => item.id != user.id);
		chat.admins.push(requestingUser);
    await this.chatRepository.save(chat);
    return;
	}

	async userRoleInChat(chatId: number, userId: number): Promise<string> {
		const chat: Chat = await this.findById(chatId, ['members', 'admins', 'owner']);
		if (chat === undefined) {
			throw new NotFoundException();
		}
		const user: User = await this.userService.findById(userId);
		if (chat.owner.id === user.id) {
			return "OWNER";
		}
		for (const admin of chat.admins) {
			if (admin.id === user.id) {
				return "ADMIN";
			}
		}
		for (const member of chat.members) {
			if (member.id === user.id) {
				return "MEMBER";
			}
		}
		throw new NotFoundException();
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
		if (len > 20) {
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
