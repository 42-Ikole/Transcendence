import { ApiTags, ApiParam } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  UseGuards,
  Req,
	Delete,
	ParseIntPipe,
	Patch,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto, CreateChatInterface, AllChatsDto, ChatUserDto, ChatPasswordDto } from './chat.types';
import { Chat } from 'src/orm/entities/chat.entity';
import { User } from 'src/orm/entities/user.entity';
import { Message } from 'src/orm/entities/message.entity';
import { SocketService } from 'src/websocket/socket.service';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from '../auth/auth.types';

@ApiTags('chat')
@Controller('chat')
@UseGuards(AuthenticatedGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private socketService: SocketService,
  ) {}

  @Get()
  async findAll(@Req() request: RequestWithUser): Promise<AllChatsDto> {
    // Get all basic information about the chat rooms.
    return await this.chatService.findAll(request.user);
  }

  @Get('/messages/:chatname')
  @ApiParam({
    name: 'chatname',
    required: true,
    description: 'Name of a chatroom',
    type: String,
  })
  async getMessagesForChat(@Param('chatname') chatname: string): Promise<Message[]> {
    // Get all the messages for a particular chat.
    const chat: Chat = await this.chatService.findByName(chatname, [
      'messages',
			'messages.author',
    ]);
    if (chat === undefined) throw new NotFoundException();
    return chat.messages;
  }

  @Get('/users/:chatname')
  @ApiParam({
    name: 'chatname',
    required: true,
    description: 'Name of a chatroom',
    type: String,
  })
  async getUsersForChat(@Param('chatname') chatname: string): Promise<User[]> {
    // Get all the members for a particular chat.
    const chat: Chat = await this.chatService.findByName(chatname, ['members']);
    if (chat === undefined) throw new NotFoundException();
    return chat.members;
  }

	@Get('/admins/:chatname')
	@ApiParam({
		name: 'chatname',
		required: true,
		description: 'Name of a chatroom',
		type: String,
	})
	async getAdminsForChat(@Param('chatname') chatname: string): Promise<User[]> {
		// Get all the admins for a particular chat.
		const chat: Chat = await this.chatService.findByName(chatname, ['admins']);
		if (chat === undefined) {
			throw new NotFoundException();
		}
		return chat.admins;
	}

	@Get('/role/:chatid/:userid')
	@ApiParam({
		name: 'chatid',
		required: true,
		description: 'Id of a chatroom',
		type: Number,
	})
	@ApiParam({
		name: 'userid',
		required: true,
		description: 'Id of a user',
		type: Number,
	})
	async getRoleForUserInChat(@Param('chatid', ParseIntPipe) chatId: number, @Param('userid', ParseIntPipe) userId: number): Promise<string> {
		return await this.chatService.userRoleInChat(chatId, userId);
	}

  @Post()
  async createChat(
    @Req() request: RequestWithUser,
    @Body() body: CreateChatDto,
  ): Promise<Chat> {
    // Create an interface from the DTO.
    const createChatInterface: CreateChatInterface = {
      ...body,
      owner: request.user,
      members: [request.user],
		};
    // Add the chat to the database.
    return await this.chatService.createChat(createChatInterface);
	}

	@Delete('/:chatid')
	@ApiParam({
		name: 'chatid',
		required: true,
		description: 'Id of a chatroom',
		type: Number,
	})
	async deleteChat(
		@Req() request: RequestWithUser,
		@Param('chatid', ParseIntPipe) chatId: number,
		): Promise<void> {
		await this.chatService.deleteChat(request.user, chatId);
	}

	@Post('/password')
	async addPassword(
		@Req() request: RequestWithUser,
		@Body() body: ChatPasswordDto,
	): Promise<void> {
		// Add a password to this chatroom.
		await this.chatService.addPassword(request.user, body.chatId, body.password);
	}

	@Patch('/password')
	async changePassword(
		@Req() request: RequestWithUser,
		@Body() body: ChatPasswordDto,
	): Promise<void> {
		// Change a password in a chatroom.
		await this.chatService.changePassword(request.user, body.chatId, body.password);
	}

	@Delete('/password/:chatid')
	@ApiParam({
		name: 'chatid',
		required: true,
		description: 'Id of a chatroom',
		type: Number,
	})
	async removePassword(
		@Req() request: RequestWithUser,
		@Param('chatid', ParseIntPipe) chatId: number,
	): Promise<void> {
		// Remove a password from a room.
		await this.chatService.removePassword(request.user, chatId);
	}

	@Post('/admin')
	async promoteAdmin(
		@Req() request: RequestWithUser,
		@Body() body: ChatUserDto,
	): Promise<void> {
		// Set the new user to admin, if possible.
		await this.chatService.promoteAdmin(request.user, body.chatId, body.userId);
	}

	@Delete('/admin')
	async demoteAdmin(
		@Req() request: RequestWithUser,
		@Body() body: ChatUserDto,
	): Promise<void> {
		// Remove the user as admin, if possible.
		await this.chatService.demoteAdmin(request.user, body.chatId, body.userId);
	}

	@Post('/owner')
	async changeRoomOwner(
		@Req() request: RequestWithUser,
		@Body() body: ChatUserDto,
	): Promise<void> {
		// Change the room owner, if possible.
		await this.chatService.changeRoomOwner(request.user, body.chatId, body.userId);
	}

	@Post('/invite')
	async inviteUser(
		@Req() request: RequestWithUser,
		@Body() body: ChatUserDto,
	): Promise<void> {
		// Invite a user to a private chat.
		await this.chatService.inviteUserToChat(request.user, body.chatId, body.userId);
	}

	@Delete('/invite')
	async uninviteUser(
		@Req() request: RequestWithUser,
		@Body() body: ChatUserDto,
	): Promise<void> {
		// Uninvite a user to a private chat.
		await this.chatService.removeInviteToChat(request.user, body.chatId, body.userId);
	}

	@Get('/invite')
	async getInvites(
		@Req() request: RequestWithUser,
	): Promise<Chat[]> {
		// Get the chats where the requesting user has been invited.
		return await this.chatService.getUserInvites(request.user);
	}
}
