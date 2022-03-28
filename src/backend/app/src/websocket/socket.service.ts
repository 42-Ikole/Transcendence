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

type SocketTypes = "pong" | "status" | "chatroom";
type SocketMap = Record<number, UserSocket>;

@Injectable()
export class SocketService {
    public pongServer: Server = null;
    public statusServer: Server = null;

    public sockets: SocketMap = {}; // userId -> relatedSockets

    addSocket(userId: number, type: SocketTypes, socket: SocketWithUser) {
        if (!this.sockets[userId]) {
            this.sockets[userId] = { pong: null, status: null, chatroom: null};
        }
        this.sockets[userId][type] = socket;
    }

    deleteSocket(userId: number) {
        delete this.sockets[userId];
    }
}
