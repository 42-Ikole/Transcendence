import { Injectable } from '@nestjs/common';
import { SocketWithUser } from 'src/websocket/websocket.types';
import { GameRoom } from './pong.types';
import { Server } from 'socket.io';
import { SessionUser } from 'src/auth/auth.types';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { decodeCookie } from 'src/websocket/cookie';

@Injectable()
export class PongService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  private waitingUser: SocketWithUser | null = null;
  private gameRooms: Record<string, GameRoom> = {}; // roomName -> extra room Data
  private sockets: Record<string, SocketWithUser> = {}; // socketId -> User Socket, TODO: should be userId and multiple logins by same user should be denied
  private socketIds: Record<number, string> = {}; // userId -> socketId
  private disconnectedUsers: Record<number, string> = {}; // userId -> roomName

  addClient(client: SocketWithUser) {
    this.sockets[client.id] = client;
  }

  async userFromCookie(cookie: string) {
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

  removeClient(client: SocketWithUser) {
    if (this.waitingUser && this.waitingUser.id === client.id) {
      console.log(client.user.username, "stopped searching");
      this.waitingUser = null;
    }
    delete this.socketIds[client.id];
  }

  isPlaying(client: SocketWithUser) {
    return !!client.gameRoom;
  }

  disconnectUser(client: SocketWithUser) {
    console.log(client.user.username, "disconnected from game:", client.gameRoom);
    this.disconnectedUsers[client.user.id] = client.gameRoom;
    this.setDisconnectedFlag(client.gameRoom, client.id);
  }

  bothPlayersDisconnected(roomName: string) {
    const gameRoom = this.gameRooms[roomName];
    return gameRoom.playerOne.disconnected && gameRoom.playerTwo.disconnected;
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

  enterMatchmakingQueue(client: SocketWithUser) {
    this.waitingUser = client;
  }

  canMatch(client: SocketWithUser): boolean {
    return this.waitingUser !== null;
  }

  getMatch(client: SocketWithUser) {
    const waiting = this.waitingUser;
    this.waitingUser = null;
    return waiting;
  }

  isDisconnected(client: SocketWithUser): boolean {
    return !!this.disconnectedUsers[client.user.id];
  }

  deleteDisconnectedUser(userId: number) {
    delete this.disconnectedUsers[userId];
  }

  deleteGameRoom(roomName: string) {
    clearInterval(this.gameRooms[roomName].intervalId);
    this.deleteDisconnectedUser(this.gameRooms[roomName].playerOne.userId);
    this.deleteDisconnectedUser(this.gameRooms[roomName].playerTwo.userId);
    const gameRoom = this.gameRooms[roomName];
    this.sockets[gameRoom.playerOne.socketId].gameRoom = null;
    this.sockets[gameRoom.playerTwo.socketId].gameRoom = null;
    delete this.gameRooms[roomName];
  }

  // Should only call IF isDisconnected returns TRUE
  reconnectUser(client: SocketWithUser) {
    const roomName = this.disconnectedUsers[client.user.id];
    client.gameRoom = roomName;
    if (this.gameRooms[roomName].playerOne.disconnected) {
      this.gameRooms[roomName].playerOne.socketId = client.id;
      this.gameRooms[roomName].playerOne.disconnected = false;
    } else {
      this.gameRooms[roomName].playerTwo.socketId = client.id;
      this.gameRooms[roomName].playerTwo.disconnected = false;
    }
    this.deleteDisconnectedUser(client.user.id);
  }

  generateRoomName() {
    return '_' + Math.random().toString(36).slice(2, 9);
  }

  addGameRoom(roomName: string, gameRoom: GameRoom) {
    this.gameRooms[roomName] = gameRoom;
  }

  getGameRoom(roomName: string) {
    return this.gameRooms[roomName];
  }

  getGameState(roomName: string) {
    return this.gameRooms[roomName].gameState;
  }
}
