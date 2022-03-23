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
  ) {}

  @WebSocketServer() wss: Server;
  waitingUser: SocketWithUser | null;
  gameRooms: Record<string, GameRoom> = {}; // roomName -> extra room Data
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
      delete this.disconnectedUsers[client.user.username];
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
    console.log('/pong Disconnect:', client.user.username);
  }

  handleGameDisconnect(client: SocketWithUser) {
    if (!this.gameRooms[client.gameRoom]) {
      return;
    }
    this.disconnectedUsers[client.user.id] = client.gameRoom;
    const gameRoom = this.gameRooms[client.gameRoom];
    if (gameRoom.playerOne.socketId === client.id) {
      gameRoom.playerOne.disconnected = true;
    } else {
      gameRoom.playerTwo.disconnected = true;
    }
    if (gameRoom.playerOne.disconnected && gameRoom.playerTwo.disconnected) {
      delete this.disconnectedUsers[gameRoom.playerOne.userId];
      delete this.disconnectedUsers[gameRoom.playerTwo.userId];
      console.log("both players disconnected, removing gameRoom:", client.gameRoom);
      this.deleteGame(client.gameRoom);
    }
  }

  deleteGame(roomName: string) {
    this.wss.to(roomName).emit("gameOver");
    clearInterval(this.gameRooms[roomName].intervalId);
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
      console.error("WARNING:", clientOne.user.username, "is playing with themself.");
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
