import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ValidationPipe, UsePipes, UnauthorizedException } from '@nestjs/common';
import { IncomingMessageDtO, ChatRoomDto, AllChatsDto } from './chat.types';
import { SocketWithUser } from 'src/websocket/websocket.types';
import { CookieService } from 'src/websocket/cookie.service';
import { ChatService } from './chat.service';
import { Message } from 'src/orm/entities/message.entity';
import { Chat } from 'src/orm/entities/chat.entity';
import { SocketService } from 'src/websocket/socket.service';
import { UserIdDto } from 'src/status/status.types';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:8080', 'http://localhost:3000'],
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private chatService: ChatService,
    private cookieService: CookieService,
    private socketService: SocketService,
  ) {}
  @WebSocketServer() wss: Server;

  afterInit(server: Server) {
    this.socketService.chatServer = server;
  }

  handleDisconnect(client: SocketWithUser) {
    if (!client.user) {
      return;
		}
  }

  async handleConnection(client: SocketWithUser) {
    client.user = await this.cookieService.userFromCookie(
      client.handshake.headers.cookie,
    );
    if (!client.user) {
      client.disconnect();
      return;
    }
    const chats: AllChatsDto = await this.chatService.findAll(client.user);
    for (const chat of chats.joinedChats) {
      client.join(chat.name);
		}
		this.socketService.addSocket(client.user.id, 'chatroom', client);
  }

  @SubscribeMessage('messageToChat')
  async messageToChat(
    @MessageBody() data: IncomingMessageDtO,
    @ConnectedSocket() client: SocketWithUser,
  ): Promise<void> {
    // Verify if user is in this room.
    const chat: Chat = await this.chatService.findByName(data.chatName, [
      'members', 'mutes', 'bans'
		]);
		if (await this.chatService.userIsBanned(client.user, chat) || await this.chatService.userIsMuted(client.user, chat)) {
			return ;
		}
    for (const member of chat.members) {
      if (member.id === client.user.id) {
        const addedMessage: Message = await this.chatService.addMessage(
          data,
          client.user,
        );
        this.wss.to(chat.name).emit('messageToClient', {
          chatName: chat.name,
          message: addedMessage,
        });
        return;
      }
    }
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() data: ChatRoomDto,
    @ConnectedSocket() client: SocketWithUser,
  ): Promise<void> {
    // If user is already in the room, skip password check

    // Verify password

    const chat: Chat = await this.chatService.findByName(data.roomName, [
      'members', 'bans'
		]);
		if (await this.chatService.userIsBanned(client.user, chat)) {
			client.emit('joinRoomBanned');
			return ;
		}
    if (this.chatService.userIsInChat(client.user, chat)) {
      client.emit('joinRoomSuccess');
      return;
    }
    const success: boolean = await this.chatService.matchPassword(
      data.roomName,
      data.password,
    );
    if (!success || chat === undefined) {
      client.emit('joinRoomFailure');
      return;
    }
    await this.chatService.userJoinsRoom(client.user, chat);
    client.emit('joinRoomSuccess');
    this.wss
      .to(chat.name)
      .emit('userJoinedRoom', { chatName: chat.name, user: client.user });
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody() data: ChatRoomDto,
    @ConnectedSocket() client: SocketWithUser,
  ): Promise<void> {
    const chat: Chat = await this.chatService.findByName(data.roomName, [
      'members', 'admins'
    ]);
    if (
      chat === undefined ||
      !this.chatService.userIsInChat(client.user, chat)
    ) {
      client.emit('leaveRoomSuccess');
      return;
    }
    client.leave(data.roomName);
    await this.chatService.userLeavesRoom(client.user, chat);
  }

  @SubscribeMessage('subscribeToChat')
  async subscribeToChat(
    @MessageBody() data: ChatRoomDto,
    @ConnectedSocket() client: SocketWithUser,
  ): Promise<void> {
    const chat: Chat = await this.chatService.findByName(data.roomName, [
      'members',
    ]);
    if (chat === undefined) {
      client.emit('subscribeToChatFailure');
      return;
    }
    if (this.chatService.userIsInChat(client.user, chat)) {
      client.join(chat.name);
      client.emit('subscribeToChatSuccess');
    } else {
      client.emit('subscribeToChatFailure');
    }
  }

  @SubscribeMessage('unsubscribeToChat')
  async unsubscribeToChat(
    @MessageBody() data: ChatRoomDto,
    @ConnectedSocket() client: SocketWithUser,
  ): Promise<void> {
    client.leave(data.roomName);
  }

  @SubscribeMessage("subscribeChatUpdateInvite")
  async subscribeChatUpdateInvite(@ConnectedSocket() client: SocketWithUser, @MessageBody() data: UserIdDto) {
    // validate that user is in the chatroom
    const chat = await this.chatService.findById(data.id, ["owner", "admins"]);
    if (!this.chatService.userHasAdminPrivilege(client.user, chat)) {
      throw new UnauthorizedException();
    }
    // subscribe to updates on invites
    client.join(`chatUpdateInvite_${data.id}`)
  }

  @SubscribeMessage("unsubscribeChatUpdateInvite")
  async unsubscribeChatUpdateInvite(@ConnectedSocket() client: SocketWithUser, @MessageBody() data: UserIdDto) {
    client.leave(`chatUpdateInvite_${data.id}`)
  }

  @SubscribeMessage("subscribeBanMuteUpdate")
  async subscribeBanMuteUpdate(@ConnectedSocket() client: SocketWithUser, @MessageBody() data: UserIdDto) {
    // validate that user is in the chatroom
    const chat = await this.chatService.findById(data.id, ["owner", "admins"]);
    if (!this.chatService.userHasAdminPrivilege(client.user, chat)) {
      throw new UnauthorizedException();
    }
    // subscribe to updates on invites
    client.join(`banMuteUpdate_${data.id}`)
  }

  @SubscribeMessage("unsubscrubeBanMuteUpdate")
  async unsubscrubeBanMuteUpdate(@ConnectedSocket() client: SocketWithUser, @MessageBody() data: UserIdDto) {
    client.leave(`banMuteUpdate_${data.id}`)
  }
}
