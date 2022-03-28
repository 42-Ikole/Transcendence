import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
    public pongServer: Server = null;
    public statusServer: Server = null;
}
