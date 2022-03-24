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
import { gameHasEnded, movePlayer, newGameState, updateGamestate } from './pong.game';
import { ClientRequest } from 'http';
import { PongService } from './pong.service';

/*
Endpoints:
  `requestMatch`
  `movement`
*/

@WebSocketGateway({
  namespace: '/pong',
  cors: {
    credentials: true,
    origin: ['http://localhost:8080', 'http://localhost:3000'],
  },
})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private pongService: PongService,
  ) {}

  @WebSocketServer() wss: Server;
  waitingUser: SocketWithUser | null;
  gameRooms: Record<string, GameRoom> = {}; // roomName -> extra room Data
  sockets: Record<string, SocketWithUser> = {}; // socketId -> User Socket, TODO: should be userId and multiple logins by same user should be denied
  socketIds: Record<number, string> = {}; // userId -> socketId
  disconnectedUsers: Record<number, string> = {}; // userId -> roomName

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
      this.sockets[client.id] = client;
      this.handleReconnect(client);
    }
  }

  handleReconnect(client: SocketWithUser) {
    const roomName = this.disconnectedUsers[client.user.id];
    if (roomName && this.gameRooms[roomName]) {
      console.log("reconnecting", client.user.username, "to", roomName);
      if (this.gameRooms[roomName].playerOne.disconnected) {
        this.gameRooms[roomName].playerOne.socketId = client.id;
        this.gameRooms[roomName].playerOne.disconnected = false;
      } else {
        this.gameRooms[roomName].playerTwo.socketId = client.id;
        this.gameRooms[roomName].playerTwo.disconnected = false;
      }
      client.gameRoom = roomName;
      client.join(roomName);
      client.emit('startGame');
    }
    if (roomName) {
      this.deleteDisconnectedUser(client.user.id);
    }
  }

  handleDisconnect(client: SocketWithUser) {
    if (this.waitingUser && client.id === this.waitingUser.id) {
      console.log(client.user.username, "stopped searching");
      this.waitingUser = null;
    } else if (client.gameRoom) {
      console.log(client.user.username, "disconnected from game:", client.gameRoom);
      this.handleGameDisconnect(client);
    }
    delete this.sockets[client.id];
    console.log('/pong Disconnect:', client.user.username);
  }

  handleGameDisconnect(client: SocketWithUser) {
    if (!this.gameRooms[client.gameRoom]) {
      return;
    }
    this.disconnectedUsers[client.user.id] = client.gameRoom;
    const gameRoom = this.gameRooms[client.gameRoom];
    this.setDisconnectedFlag(client.gameRoom, client.id);
    if (gameRoom.playerOne.disconnected && gameRoom.playerTwo.disconnected) {
      console.log("both players disconnected, removing gameRoom:", client.gameRoom);
      this.deleteGame(client.gameRoom);
    }
  }

  setDisconnectedFlag(roomName: string, socketId: string) {
    const gameRoom = this.gameRooms[roomName];
    if (gameRoom.playerOne.socketId === socketId) {
      gameRoom.playerOne.disconnected = true;
    } else if (gameRoom.playerTwo.socketId === socketId) {
      gameRoom.playerTwo.disconnected = true;
    } else {
      console.error("cannot find disconnected game for:", socketId, "in room", roomName);
    }
  }

  deleteDisconnectedUser(id: number) {
    if (this.disconnectedUsers[id]) {
      console.log("deleting disconnected user:", id);
      delete this.disconnectedUsers[id];
    }
  }

  deleteGame(roomName: string) {
    this.deleteDisconnectedUser(this.gameRooms[roomName].playerOne.userId);
    this.deleteDisconnectedUser(this.gameRooms[roomName].playerTwo.userId);
    this.wss.to(roomName).emit("endGame", this.gameRooms[roomName].gameState);
    clearInterval(this.gameRooms[roomName].intervalId);
    this.deleteRoom(roomName);
  }

  // For each client in said room
  deleteRoom(roomName: string) {
    this.wss.socketsLeave(roomName);
    const gameRoom = this.gameRooms[roomName];
    this.sockets[gameRoom.playerOne.socketId].gameRoom = null;
    this.sockets[gameRoom.playerTwo.socketId].gameRoom = null;
    delete this.gameRooms[roomName];
  }

  endGame(roomName: string) {
    console.log("game ended:", roomName);
    this.deleteGame(roomName);
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
      // User shouldn't be able to search while they are already searching on a different machine
      console.log("found match");
      this.startNewGame(this.waitingUser, client);
      this.waitingUser = null;
    }
  }

  generateRoomName() {
    return '_' + Math.random().toString(36).slice(2, 9);
  }

  // Create a new unique room for these clients to play in
  // Signal to the clients that they can play
  // Add the game to a record (map) of games being played
  startNewGame(clientOne: SocketWithUser, clientTwo: SocketWithUser) {
    if (clientOne.user.id === clientTwo.user.id) {
      clientOne.emit("exception", "WARNING: you are playing with yourself");
      clientTwo.emit("exception", "WARNING: you are playing with yourself");
    }
    const roomName = this.generateRoomName();
    console.log(clientOne.user.username, "vs", clientTwo.user.username, "in", roomName);
    this.joinRoom(clientOne, roomName);
    this.joinRoom(clientTwo, roomName);
    this.wss.to(roomName).emit('startGame');
    const gameState = newGameState(clientOne.user.username, clientTwo.user.username);
    const intervalId = this.startGameLoop(roomName, gameState);
    // Room data
    this.gameRooms[roomName] = {
      intervalId,
      playerOne: { socketId: clientOne.id, userId: clientOne.user.id, disconnected: false },
      playerTwo: { socketId: clientTwo.id, userId: clientTwo.user.id, disconnected: false },
      observers: [],
      gameState,
    };
  }

  joinRoom(client: SocketWithUser, roomName: string) {
    client.join(roomName);
    client.gameRoom = roomName;
  }

  startGameLoop(roomName: string, gameState: GameState) {
    const intervalId = setInterval(() => {
      updateGamestate(gameState);
      if (gameHasEnded(gameState)) {
        this.endGame(roomName);
      } else {
        this.wss.to(roomName).emit('updatePosition', gameState);
      }
    }, 1000 / 60);
    return intervalId;
  }

  @SubscribeMessage('movement')
  movement(client: SocketWithUser, data: Boolean[]) {
    const room = client.gameRoom;
    if (!room) {
      return;
    }
    const gameRoom = this.gameRooms[room];
    if (client.id === gameRoom.playerOne.socketId) {
      movePlayer(gameRoom.gameState.playerOne.bar, data);
    } else if (client.id === gameRoom.playerTwo.socketId) {
      movePlayer(gameRoom.gameState.playerTwo.bar, data);
    }
  }
}
