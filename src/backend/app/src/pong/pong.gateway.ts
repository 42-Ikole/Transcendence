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
// @UseGuards(WebsocketGuard)
// @UseFilters(WsExceptionFilter)
// @UsePipes(new ValidationPipe())
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
    if (!client.user) {
      console.log("/pong connection denied: NO USER FOUND:", client.id);
      client.disconnect();
    } else {
      console.log('/pong connect:', client.user.username);
      this.checkIfDisconnected(client);
    }
  }

  checkIfDisconnected(client: SocketWithUser) {
    const roomName = this.disconnectedUsers[client.user.username];
    if (roomName && this.gameRooms[roomName]) {
      console.log("reconnecting", client.user.username, "to", roomName);
      client.gameRoom = roomName;
      client.join(roomName);
      client.emit('startGame');
    }
    if (roomName) {
      delete this.disconnectedUsers[client.user.username];
    }
  }

  handleDisconnect(client: SocketWithUser) {
    if (this.waitingUser && client.id === this.waitingUser.id) {
      console.log(client.user.username, "stopped searching");
      this.waitingUser = null;
    } else if (client.gameRoom) {
      console.log(client.user.username, "disconnected from game:", client.gameRoom);
      this.disconnectedUsers[client.user.username] = client.gameRoom;
      this.handleGameDisconnect(client);
    }
    console.log('/pong Disconnect:', client.user.username);
  }

  handleGameDisconnect(client: SocketWithUser) {
    const userOne = this.gameStates[client.gameRoom].playerOne.username;
    const userTwo = this.gameStates[client.gameRoom].playerTwo.username;
    if (this.disconnectedUsers[userOne] && this.disconnectedUsers[userTwo]) {
      delete this.disconnectedUsers[userOne];
      delete this.disconnectedUsers[userTwo];
      this.endGame(client.gameRoom);
      console.log("both players disconnected, removing gameRoom:", client.gameRoom);
    }
  }

  endGame(roomName: string) {
    clearInterval(this.gameRooms[roomName].intervalId);
    delete this.gameRooms[roomName];
    delete this.gameStates[roomName];
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
      console.log(client.user.username, "is searching");
		  this.waitingUser = client;
	  } else if (this.waitingUser.id != client.id) {
      // TODO: disallow a user to play against themselves, for now it is useful for testing
      console.log("found match");
      this.startNewGame(this.waitingUser, client);
      this.waitingUser = null;
    }
  }

  gameRooms: Record<string, GameRoom> = {}; // roomName -> extra room Data
  gameStates: Record<string, GameState> = {}; // roomName -> GameState
  disconnectedUsers: Record<string, string> = {}; // userName -> roomName
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
    clientOne.gameRoom = roomName;
    clientTwo.gameRoom = roomName;
    this.wss.to(roomName).emit('startGame');
    this.gameStates[roomName] = newGameState(clientOne.user.username, clientTwo.user.username);

    const INTERVAL = 1000 / 60;
    const intervalId = setInterval(() => {
      updateGamestate(this.gameStates[roomName], INTERVAL);
      // this.wss.to(roomName).emit('updatePosition', this.gameStates[roomName]);
    }, INTERVAL);

    this.gameRooms[roomName] = {
      intervalId,
      clientOne,
      clientTwo,
      name: roomName,
    };
  }

  @SubscribeMessage('requestUpdate')
  requestUpdate(client: SocketWithUser) {
    if (client.gameRoom) {
      client.emit('updatePosition', this.gameStates[client.gameRoom]);
    }
  }
  
  @SubscribeMessage('movement')
  movement(client: SocketWithUser, data: Boolean[]) {
    if (!this.gameRooms[client.gameRoom]) {
      return;
    }
    if (client.id === this.gameRooms[client.gameRoom].clientOne.id) {
      movePlayer(this.gameStates[client.gameRoom].playerOne.bar, data);
    } else if (client.id === this.gameRooms[client.gameRoom].clientTwo.id) {
      movePlayer(this.gameStates[client.gameRoom].playerTwo.bar, data);
    }
    client.emit('updatePosition', this.gameStates[client.gameRoom]);
  }
}
