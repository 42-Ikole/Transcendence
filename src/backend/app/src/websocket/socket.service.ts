import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { SocketWithUser } from './websocket.types';

/*
This service is used for globally accessing the websockets

Stores:
- Servers
- Socketmap: userId -> Sockets
*/

interface UserSocket {
  pong: SocketWithUser | null;
  status: SocketWithUser | null;
  chatroom: SocketWithUser | null;
}

type SocketTypes = 'pong' | 'status' | 'chatroom';
type SocketMap = Record<number, UserSocket>;

@Injectable()
export class SocketService {
  public pongServer: Server = null;
  public statusServer: Server = null;
  public chatServer: Server = null;

  public sockets: SocketMap = {}; // userId -> relatedSockets

  addSocket(userId: number, type: SocketTypes, socket: SocketWithUser) {
    if (!this.sockets[userId]) {
      this.reserveSocket(userId);
    }
    console.log('adding socket:', userId, type);
    this.sockets[userId][type] = socket;
  }

  reserveSocket(userId: number) {
    this.sockets[userId] = { pong: null, status: null, chatroom: null };
  }

  deleteSocket(userId: number) {
    console.log('Deleting socket:', userId);
    delete this.sockets[userId];
  }

  disconnectUser(userId: number) {
    if (this.userExists(userId)) {
      if (this.sockets[userId].chatroom) {
        this.sockets[userId].chatroom.disconnect();
      }
      if (this.sockets[userId].pong) {
        this.sockets[userId].pong.disconnect();
      }
      if (this.sockets[userId].status) {
        this.sockets[userId].status.disconnect();
      }
    }
    this.deleteSocket(userId);
  }

  userExists(userId: number): boolean {
    return !!this.sockets[userId];
  }

  userExistsType(userId: number, type: SocketTypes): boolean {
    return !!this.sockets[userId] && !!this.sockets[userId][type];
  }
}
