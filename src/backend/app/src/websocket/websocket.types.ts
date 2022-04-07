import { IsIn, IsInt, IsNumber, IsString, ValidateIf } from 'class-validator';
import { Socket } from 'socket.io';
import { User } from 'src/orm/entities/user.entity';

export interface SocketWithUser extends Socket {
  user: User | null;
  gameRoom?: string;
}

const MATCH_TYPES = ['matchmaking', 'challenge'];

export class RequestMatchDto {
  @IsIn(MATCH_TYPES)
  type: string;

  @IsNumber()
  @ValidateIf((object, value) => value !== null)
  targetId: number | null;
}

export class ObserveGameDto {
  @IsString()
  @ValidateIf((object: any) => object.userId === undefined || object.roomName)
  roomName: string;

  @IsInt()
  @ValidateIf((object: any) => object.roomName === undefined || object.userId)
  userId: number;
}
