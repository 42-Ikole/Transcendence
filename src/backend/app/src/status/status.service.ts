import { Injectable } from "@nestjs/common";
import { SocketService } from "src/websocket/socket.service";

/*
The point of this class is to update the status of a user and emit it
We will have an IN MEMORY stored table of <userId> -> <status>

Why IN MEMORY and not database?
    - it is not necessary to persist this information
    - it is accessed often and a database lookup would be more inefficent
*/


// NULL or MISSING === OFFLINE
type UserState =
    "OFFLINE"
  | "ONLINE"
  | "SEARCHING"
  | "PLAYING"
  | "OBSERVING"
  | "CHALLENGED";

type UserStatusMap = Record<number, UserState>; // userId -> status

@Injectable()
export class StatusService {
    constructor(
        private socketService: SocketService,
    ) {}
    private userStatus: UserStatusMap = {};

    updateUserState(id: number, state: UserState) {
        if (state === "OFFLINE") {
            delete this.userStatus[id];
        } else {
            this.userStatus[id] = state;
        }
        this.socketService.statusServer.emit("statusUpdate", {
            id: id,
            newState: state,
        });
    }

    getStates(): UserStatusMap {
        return this.userStatus;
    }
}
