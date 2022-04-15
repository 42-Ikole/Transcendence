import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketService } from 'src/websocket/socket.service';
import { SocketWithUser } from 'src/websocket/websocket.types';
import { CookieService } from 'src/websocket/cookie.service';
import { StatusService } from './status.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { UserIdDto } from './status.types';

/*
Responsibilities:
  - User status change
  - Friend requests
  - Blocked users (can be chatroom)
*/

@WebSocketGateway({
  namespace: '/status',
  cors: {
    credentials: true,
    origin: ['http://localhost:8080', 'http://localhost:3000'],
  },
})
export class StatusGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private socketService: SocketService,
    private statusService: StatusService,
    private cookieService: CookieService,
  ) {}

  afterInit(server: Server) {
    this.socketService.statusServer = server;
  }

  async handleConnection(client: SocketWithUser) {
    client.user = await this.cookieService.userFromCookie(
      client.handshake.headers.cookie,
    );
    if (
      !client.user ||
      this.socketService.userExistsType(client.user.id, 'status')
    ) {
      console.log('/status: connection denied:', client.id);
      client.disconnect();
      return;
    }
    console.log('Status Connect: ', client.user.id);
    this.socketService.addSocket(client.user.id, 'status', client);
    if (this.statusService.getState(client.user.id) === 'OFFLINE') {
      this.statusService.updateUserState(client.user.id, 'ONLINE');
    }
  }

  handleDisconnect(client: SocketWithUser) {
    if (!client.user) {
      return;
    }
    this.statusService.updateUserState(client.user.id, 'OFFLINE');
    this.socketService.deleteSocket(client.user.id);
  }

  // Subscribe to `statusUpdate_${UID}` message
  // Also emits the current status immediately after joining room
  @SubscribeMessage('subscribeStatusUpdate')
  @UsePipes(new ValidationPipe())
  subscribeStatus(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() body: UserIdDto,
  ) {
    client.join(`statusUpdate_${body.id}`);
    client.emit(`statusUpdate_${body.id}`, {
      id: body.id,
      newState: this.statusService.getState(body.id),
    });
  }

  @SubscribeMessage('unsubscribeStatusUpdate')
  @UsePipes(new ValidationPipe())
  unsubscribeStatus(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() body: UserIdDto,
  ) {
    client.leave(`statusUpdate_${body.id}`);
  }
}
