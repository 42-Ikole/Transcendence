import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server } from "socket.io";
import { SocketService } from "src/websocket/socket.service";
import { SocketWithUser } from "src/websocket/websocket.types";
import { CookieService } from "src/websocket/cookie.service";
import { StatusService } from "./status.service";

/*
Responsibilities:
  - Friend requests
  - User status change
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
    if (!client.user) {
      console.log('/pong connection denied: NO USER FOUND:', client.id);
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
    this.socketService.deleteSocket(client.user.id);
    this.statusService.updateUserState(client.user.id, "OFFLINE");
  }
}
