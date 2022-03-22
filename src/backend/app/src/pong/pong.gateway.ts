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
import { GameRoom, GameState } from './pong.types';
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

  gameRooms: Record<string, GameRoom> = {};
  gameStates: Record<string, GameState> = {};
  // Create a new unique room for these clients to play in
  // Signal to the clients that they can play
  // Add the game to a list of games being played (memory? database?)
  startNewGame(clientOne: SocketWithUser, clientTwo: SocketWithUser) {
    let roomName = "room01";
    if (this.gameStates[roomName]) {
      roomName = "room02";
    }
    clientOne.join(roomName);
    clientTwo.join(roomName);
    this.wss.to(roomName).emit('startGame');
    this.gameStates[roomName] = newGameState(clientOne.user.username, clientTwo.user.username);

    const INTERVAL = 50;
    const intervalId = setInterval(() => {
      updateGamestate(this.gameStates[roomName], INTERVAL);
      this.wss.to(roomName).emit('updatePosition', this.gameStates[roomName]);
    }, INTERVAL);

    this.gameRooms[roomName] = {
      intervalId,
      clientOne,
      clientTwo,
      name: roomName,
    };
  }

  @SubscribeMessage('movement')
  movement(client: SocketWithUser, data: string) {
    if (data === "ArrowDown" || data === "ArrowUp") {
      if (client.id === this.gameRooms['room01'].clientOne.id) {
        movePlayer(this.gameStates['room01'].playerOne.bar, data);
      } else if (client.id === this.gameRooms['room01'].clientTwo.id) {
        movePlayer(this.gameStates['room01'].playerTwo.bar, data);
      }
      else if (client.id === this.gameRooms['room02'].clientOne.id) {
        movePlayer(this.gameStates['room02'].playerOne.bar, data);
      } else if (client.id === this.gameRooms['room02'].clientTwo.id) {
        movePlayer(this.gameStates['room02'].playerTwo.bar, data);
      }
    }
  }
}
