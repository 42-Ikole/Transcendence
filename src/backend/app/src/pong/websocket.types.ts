import { Socket } from "socket.io";
import { User } from "src/orm/entities/user.entity";

export interface SocketWithUser extends Socket {
	user: User;
}
