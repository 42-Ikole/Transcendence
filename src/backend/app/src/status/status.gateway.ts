import { WebSocketGateway, OnGatewayInit, OnGatewayConnection } from "@nestjs/websockets";
import { Server } from "socket.io";
import { SocketService } from "src/websocket/socket.service";
import { SocketWithUser } from "src/websocket/websocket.types";
import { CookieService } from "src/websocket/cookie.service";

@WebSocketGateway({
  namespace: '/pong',
  cors: {
    credentials: true,
    origin: ['http://localhost:8080', 'http://localhost:3000'],
  },
})
export class StatusGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(
    private socketService: SocketService,
    private cookieService: CookieService,
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
  }
}
