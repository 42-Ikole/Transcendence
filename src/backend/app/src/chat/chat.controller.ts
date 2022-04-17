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
	BadRequestException,
	UnauthorizedException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto, CreateChatInterface, AllChatsDto, ChatUserDto, ChatPasswordDto } from './chat.types';
import { Chat } from 'src/orm/entities/chat.entity';
import { User } from 'src/orm/entities/user.entity';
import { Message } from 'src/orm/entities/message.entity';
import { SocketService } from 'src/websocket/socket.service';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from '../auth/auth.types';
import { UserIdDto } from 'src/status/status.types';
import { DirectMessage } from 'src/orm/entities/directmessage.entity';
import { FriendService } from 'src/friend/friend.service';

@ApiTags('chat')
@Controller('chat')
@UseGuards(AuthenticatedGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private socketService: SocketService,
	private friendService: FriendService,
  ) {}

  @Get()
  async findAll(@Req() request: RequestWithUser): Promise<AllChatsDto> {
    // Get all basic information about the chat rooms.
    return await this.chatService.findAll(request.user);
  }

  @Get('messages')
  async getMessages() {
	return await this.chatService.findMessages();
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
		console.log(chat);
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
	async removePassword(
		@Req() request: RequestWithUser,
		@Param('chatid', ParseIntPipe) chatId: number,
	): Promise<void> {
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

	@Get('directMessage/all')
	async findAllDirectMessages() {
		return await this.chatService.findAllDirectMessages();
	}

	@Get('directMessage')
	async getDirectMessages(@Req() request: RequestWithUser) {
		const messages = await this.chatService.findDirectMessages(request.user, {
			relations: ["userOne", "userTwo"],
		});
		// filter users with block relation
		const result = await Promise.all(messages.map(async (dm) => {
			return !await this.friendService.haveBlockRelation(dm.userOne, dm.userTwo)
		}));
		return messages.filter((_v, index) => result[index]);
	}

	@Get('directMessage/authorize/:id')
	async authorizeId(@Req() request: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
		const result = await this.chatService.authorizeDirectMessage(request.user, id);
		if (!result) {
			throw new UnauthorizedException();
		}
	}

	@Get('directMessage/:id')
	async getDmMessages(@Req() request: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
		await this.authorizeId(request, id);
		const dm = await this.chatService.findDirectMessageById(id, {
			relations: ["userOne", "userTwo", "messages"],
		});
		return dm;
	}

	// Create the DM if it doesn't exist, return the new DM
	@Post('directMessage')
	async createDirectMessage(@Req() request: RequestWithUser, @Body() body: UserIdDto) {
		if (request.user.id === body.id) {
			throw new BadRequestException();
		}
		return await this.chatService.createDirectMessage(request.user, body.id);
	}
}
