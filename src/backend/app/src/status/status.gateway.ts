import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsException } from "@nestjs/websockets";
import { Server } from "socket.io";
import { SocketService } from "src/websocket/socket.service";
import { SocketWithUser } from "src/websocket/websocket.types";
import { CookieService } from "src/websocket/cookie.service";
import { StatusService } from "./status.service";

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
export class StatusGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private socketService: SocketService,
    private cookieService: CookieService,
    private statusService: StatusService,
  ) {}

  afterInit(server: Server) {
    this.socketService.statusServer = server;
  }

  async handleConnection(client: SocketWithUser) {
    client.user = await this.cookieService.userFromCookie(
      client.handshake.headers.cookie,
    );
    if (!client.user || this.socketService.userExistsType(client.user.id, "status")) {
      console.log('/status: connection denied:', client.id);
      client.disconnect();
      return;
    }
    this.socketService.addSocket(client.user.id, "status", client);
    this.statusService.updateUserState(client.user.id, "ONLINE");
  }

  handleDisconnect(client: SocketWithUser) {
    if (!client.user) {
      return;
    }
    this.statusService.updateUserState(client.user.id, "OFFLINE");
    this.socketService.deleteSocket(client.user.id);
  }
}
