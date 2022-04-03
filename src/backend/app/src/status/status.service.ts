import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/orm/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { SocketService } from 'src/websocket/socket.service';
import { Repository } from 'typeorm';
import { UserState } from "./status.types"

/*
The point of this class is to update the status of a user and emit it
We will have an IN MEMORY stored table of <userId> -> <status>

Why IN MEMORY and not database?
    - it is not necessary to persist this information
    - it is accessed often and a database lookup would be more inefficent
*/

type UserStatusMap = Record<number, UserState>; // userId -> status

@Injectable()
export class StatusService {
  constructor(
    private socketService: SocketService,
    private userService: UserService,
  ) {}

  private userStatus: UserStatusMap = {};

  updateUserState(id: number, state: UserState) {
    this.userService.update(id, { status: state });
    if (state === 'OFFLINE') {
      delete this.userStatus[id];
    } else {
      this.userStatus[id] = state;
    }
    const updatedState = {
      id: id,
      newState: state,
    };
    if (this.socketService.userExistsType(id, 'status')) {
      this.socketService.sockets[id].status.emit('statusUpdate', updatedState);
    }
    this.socketService.statusServer.emit('friendUpdate');
    this.socketService.statusServer.emit('friendStatusUpdate', updatedState);
  }

  getStates(): UserStatusMap {
    return this.userStatus;
  }

  getState(userId: number): UserState {
    if (!this.userStatus[userId]) {
      return 'OFFLINE';
    }
    return this.userStatus[userId];
  }

  emitToUser(id: number, event: string, ...args: any[]) {
    if (!this.socketService.userExists(id)) {
      console.error('tried to emit to', id, 'who is not online');
      return;
    }
    this.socketService.sockets[id].status.emit(event, args);
  }
}
