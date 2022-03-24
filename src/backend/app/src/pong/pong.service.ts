import { Injectable } from '@nestjs/common';
import { SocketWithUser } from 'src/websocket/websocket.types';
import { GameDto, GameRoom } from './pong.types';
import { Server } from 'socket.io';
import { SessionUser } from 'src/auth/auth.types';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { decodeCookie } from 'src/websocket/cookie';
import { User } from 'src/orm/entities/user.entity';

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
  private challengers: Record<string, string> = {}; // challengedSocketId -> challengerSocketId

  addClient(client: SocketWithUser) {
    this.sockets[client.id] = client;
    this.socketIds[client.user.id] = client.id;
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
    delete this.challengers[client.id];
    delete this.sockets[client.id];
    delete this.socketIds[client.user.id];
  }

  isPlaying(client: SocketWithUser) {
    return !!client.gameRoom && this.gameRooms[client.gameRoom];
  }

  disconnectUser(client: SocketWithUser) {
    const gameRoom = this.gameRooms[client.gameRoom];
    if (gameRoom && gameRoom.observers.has(client.id)) {
      console.log("disconnected from observing:", client.user.username);
      gameRoom.observers.delete(client.id);
      return;
    }
    console.log(client.user.username, "disconnected from game:", client.gameRoom);
    this.disconnectedUsers[client.user.id] = client.gameRoom;
    this.setDisconnectedFlag(client.gameRoom, client.id);
  }

  bothPlayersDisconnected(roomName: string) {
    const gameRoom = this.gameRooms[roomName];
    return gameRoom && gameRoom.playerOne.disconnected && gameRoom.playerTwo.disconnected;
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
    if (this.sockets[gameRoom.playerOne.socketId]) {
      this.sockets[gameRoom.playerOne.socketId].gameRoom = null;
    }
    if (this.sockets[gameRoom.playerTwo.socketId]) {
      this.sockets[gameRoom.playerTwo.socketId].gameRoom = null;
    }
    this.clearObservers(gameRoom);
    delete this.gameRooms[roomName];
  }

  clearObservers(gameRoom: GameRoom) {
    for (let key in gameRoom.observers) {
      this.sockets[key].gameRoom = null;
    }
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

  getClientFromId(id: number) {
    return this.sockets[this.socketIds[id]];
  }

  getActiveGames(): GameDto[] {
    const result: GameDto[] = [];
    for (let roomName in this.gameRooms) {
      result.push({
        state: this.gameRooms[roomName].gameState,
        name: roomName,
      });
    }
    return result;
  }

  gameExists(roomName: string): boolean {
    return !!this.getGameRoom(roomName);
  }

  observe(client: SocketWithUser, roomName: string) {
    client.gameRoom = roomName;
    this.gameRooms[roomName].observers.add(client.id);
  }

  cancelObserve(client: SocketWithUser) {
    this.gameRooms[client.gameRoom].observers.delete(client.id);
  }

  async getAvailableUsers(): Promise<User[]> {
    const users: User[] = [];
    for (let id in this.sockets) {
      if (!this.sockets[id].gameRoom) {
        users.push(this.sockets[id].user);
      }
    }
    return users;
  }

  isChallenged(client: SocketWithUser) {
    return !!this.challengers[client.id];
  }

  addChallenger(client: SocketWithUser, target: SocketWithUser) {
    this.challengers[target.id] = client.id;
  }

  hasChallenger(client: SocketWithUser): Boolean {
    return !!this.challengers[client.id] && !!this.sockets[this.challengers[client.id]];
  }

  getChallenger(client: SocketWithUser) {
    return this.sockets[this.challengers[client.id]];
  }
}
