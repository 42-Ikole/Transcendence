import { Avatar } from 'src/orm/entities/avatar.entity';

export interface IUser {
  intraId: string;
  username: string;
  avatar?: Avatar;
}
