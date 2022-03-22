import {
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseFilters,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  WebSocketServer,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SessionUser } from 'src/auth/auth.types';
import { UserService } from 'src/user/user.service';
import { decodeCookie } from '../websocket/cookie';
import { WebsocketGuard } from '../websocket/websocket.guard';
import { RequestMatchDto, SocketWithUser } from '../websocket/websocket.types';
import { WsExceptionFilter } from '../websocket/websocket.exception.filter';
import { GameRoom } from './pong.types';
import { movePlayer, newGameState, updateGamestate } from './pong.game';
import { ClientRequest } from 'http';

@WebSocketGateway({
  namespace: '/pong',
  cors: {
    credentials: true,
    origin: ['http://localhost:8080', 'http://localhost:3000'],
  },
})
@UseGuards(WebsocketGuard)
@UseFilters(WsExceptionFilter)
@UsePipes(new ValidationPipe())
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}
  @WebSocketServer() wss: Server;
  waitingUser: SocketWithUser | null;

  private async userFromCookie(cookie: string) {
    const sessionUser: SessionUser = await decodeCookie(
      cookie,
      this.configService,
    );
    if (!sessionUser) {
      return null;
    }
    const user = await this.userService.findById(sessionUser.id);
    return user;
  }

  async handleConnection(client: SocketWithUser) {
    client.user = await this.userFromCookie(client.handshake.headers.cookie);
    console.log('/pong Connect:', client.user.username);
  }

  handleDisconnect(client: SocketWithUser) {
    console.log('/pong Disconnect:', client.user.username);
  }

  /*
	Data:
		TYPE: "matchmaking" | "challenge"
		TARGET: "_user_id_" | null
	*/
  @SubscribeMessage('requestMatch')
  requestMatch(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: RequestMatchDto,
  ) {
    if (data.type === "matchmaking") {
      this.matchMaking(client);
    } else {
      console.log("Challenge:", data);
    }
  }

  // Check if there is another client ready to play, otherwise set client as waiting/searching
  matchMaking(client: SocketWithUser) {
	  if (!this.waitingUser) {
		  this.waitingUser = client;
	  } else if (this.waitingUser.id != client.id) {
      // TODO: disallow a user to play against themselves, for now it is useful for testing
      console.log("found match");
      this.startNewGame(this.waitingUser, client);
      this.waitingUser = null;
    }
  }

  gameRoom: GameRoom[] = [];
  // Create a new unique room for these clients to play in
  // Signal to the clients that they can play
  // Add the game to a list of games being played (memory? database?)
  startNewGame(clientOne: SocketWithUser, clientTwo: SocketWithUser) {
    clientOne.join("room01");
    clientTwo.join("room01");
    this.wss.to("room01").emit('startGame');
    const intervalId = setInterval(() => {
      updateGamestate(this.gameRoom[0].state);
      this.wss.to("room01").emit('updatePosition', this.gameRoom[0].state);
    }, 15)
    this.gameRoom.push({
      state: newGameState(clientOne.user.username, clientTwo.user.username),
      intervalId,
      clientOne,
      clientTwo,
    });
  }

  @SubscribeMessage('movement')
  movement(client: SocketWithUser, data: string) {
    if (data === "ArrowDown" || data === "ArrowUp") {
      if (client.id === this.gameRoom[0].clientOne.id) {
        movePlayer(this.gameRoom[0].state.playerOne.bar, data);
      } else if (client.id === this.gameRoom[0].clientTwo.id) {
        movePlayer(this.gameRoom[0].state.playerTwo.bar, data);
      }
    }
  }
}
