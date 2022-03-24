import { Injectable } from '@nestjs/common';
import { SocketWithUser } from 'src/websocket/websocket.types';
import { GameRoom } from './pong.types';

@Injectable()
export class PongService {
  constructor() {}

  private waitingUser: SocketWithUser | null;
  private gameRooms: Record<string, GameRoom> = {}; // roomName -> extra room Data
  private sockets: Record<string, SocketWithUser> = {}; // socketId -> User Socket, TODO: should be userId and multiple logins by same user should be denied
  private socketIds: Record<number, string> = {}; // userId -> socketId
  private disconnectedUsers: Record<number, string> = {}; // userId -> roomName

  addClient(client: SocketWithUser) {
    this.sockets[client.id] = client;
  }

  removeClient(client: SocketWithUser) {
    delete this.socketIds[client.id];
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

  disconnectUser(client: SocketWithUser) {
    if (!client.gameRoom) {
      return;
    }
    this.disconnectedUsers[client.user.id] = client.gameRoom;
  }

  reconnectUser(client: SocketWithUser) {
    const roomName = this.disconnectedUsers[client.user.id];
    client.gameRoom = roomName;
    delete this.disconnectedUsers[client.user.id];
  }
}
