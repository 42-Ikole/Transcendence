import { Injectable } from '@nestjs/common';
import { SocketWithUser } from 'src/websocket/websocket.types';
import { GameDto, GameRoom } from './pong.types';
import { CookieService } from 'src/websocket/cookie.service';
import { SocketService } from 'src/websocket/socket.service';
import { StatusService } from 'src/status/status.service';

@Injectable()
export class PongService {
  constructor(
    private cookieService: CookieService,
    private socketService: SocketService,
    private statusService: StatusService,
  ) {}

  private waitingUser: SocketWithUser | null = null;
  private gameRooms: Record<string, GameRoom> = {}; // roomName -> extra room Data
  private disconnectedUsers: Record<number, string> = {}; // userId -> roomName
  private challengers: Record<number, number> = {}; // challengedUserId -> challengerUserId
  private default: boolean;

  addClient(client: SocketWithUser) {
    this.socketService.addSocket(client.user.id, 'pong', client);
  }

  async userFromCookie(cookie: string) {
    return await this.cookieService.userFromCookie(cookie);
  }

  removeClient(client: SocketWithUser) {
    if (this.waitingUser && this.waitingUser.id === client.id) {
      console.log(client.user.username, 'stopped searching');
      this.waitingUser = null;
    }
    delete this.challengers[client.user.id];
  }

  isPlaying(client: SocketWithUser) {
    return !!client.gameRoom && this.gameRooms[client.gameRoom];
  }

  disconnectUser(client: SocketWithUser) {
    const gameRoom = this.gameRooms[client.gameRoom];
    if (gameRoom && gameRoom.observers.has(client.user.id)) {
      console.log('disconnected from observing:', client.user.username);
      gameRoom.observers.delete(client.user.id);
      return;
    }
    console.log(
      client.user.username,
      'disconnected from game:',
      client.gameRoom,
    );
    this.disconnectedUsers[client.user.id] = client.gameRoom;
    this.setDisconnectedFlag(client.gameRoom, client.user.id);
  }

  bothPlayersDisconnected(roomName: string) {
    const gameRoom = this.gameRooms[roomName];
    return (
      gameRoom &&
      gameRoom.playerOne.disconnected &&
      gameRoom.playerTwo.disconnected
    );
  }

  setDisconnectedFlag(roomName: string, userId: number) {
    const gameRoom = this.gameRooms[roomName];
    if (gameRoom.playerOne.userId === userId) {
      gameRoom.playerOne.disconnected = true;
    } else if (gameRoom.playerTwo.userId === userId) {
      gameRoom.playerTwo.disconnected = true;
    }
  }

  enterMatchmakingQueue(client: SocketWithUser) {
    this.waitingUser = client;
  }

  canMatch(): boolean {
    return this.waitingUser !== null;
  }

  getMatch() {
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
    const gameRoom = this.getGameRoom(roomName);
    if (this.socketService.userExistsType(gameRoom.playerOne.userId, 'pong')) {
      this.socketService.sockets[gameRoom.playerOne.userId].pong.gameRoom =
        null;
    }
    if (this.socketService.userExistsType(gameRoom.playerTwo.userId, 'pong')) {
      this.socketService.sockets[gameRoom.playerTwo.userId].pong.gameRoom =
        null;
    }
    this.clearObservers(gameRoom);
    delete this.gameRooms[roomName];
  }

  clearObservers(gameRoom: GameRoom) {
    gameRoom.observers.forEach((id) => {
      this.statusService.updateUserState(id, 'ONLINE');
      this.socketService.sockets[id].pong.gameRoom = null;
    });
  }

  // Should only be called IF isDisconnected returns TRUE
  reconnectUser(client: SocketWithUser) {
    const roomName = this.disconnectedUsers[client.user.id];
    client.gameRoom = roomName;
    if (this.gameRooms[roomName].playerOne.disconnected) {
      this.gameRooms[roomName].playerOne.disconnected = false;
    } else {
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
    return this.socketService.sockets[id].pong;
  }

  getActiveGames(): GameDto[] {
    const result: GameDto[] = [];
    for (const roomName in this.gameRooms) {
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
    client.join(roomName);
    this.gameRooms[roomName].observers.add(client.user.id);
  }

  cancelObserve(client: SocketWithUser) {
    client.leave(client.gameRoom);
    client.gameRoom = null;
    this.gameRooms[client.gameRoom].observers.delete(client.user.id);
  }

  isChallenged(client: SocketWithUser) {
    return !!this.challengers[client.user.id];
  }

  addChallenger(client: SocketWithUser, target: SocketWithUser, mode) {
    this.challengers[target.user.id] = client.user.id;
    this.default = mode;
  }

  getMode(client: SocketWithUser): boolean {
    return this.default;
  }

  // Return true IF:
  //  - the challenged is part of the challenger table AND the challenger exists
  //  - the challenger still exists
  //  - the challenger is still searching
  hasChallenger(client: SocketWithUser): boolean {
    const challengerId = this.challengers[client.user.id];
    return (
      !!this.challengers[client.user.id] &&
      !!this.socketService.userExistsType(challengerId, 'pong') &&
      this.statusService.getState(challengerId) === 'SEARCHING'
    );
  }

  deleteChallenger(client: SocketWithUser) {
    delete this.challengers[client.user.id];
  }

  getChallenger(client: SocketWithUser) {
    const id = this.challengers[client.user.id];
    return this.socketService.sockets[id].pong;
  }
}
