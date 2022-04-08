import { User } from 'src/orm/entities/user.entity';
import { Avatar } from 'src/orm/entities/avatar.entity';

// When requesting information about other users
export class PublicUser {
  id: number;
  username: string;
  status: string;
  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.status = user.status;
  }
}

// For your own profile
export class PrivateUser extends PublicUser {
  twoFactorEnabled: boolean;
  constructor(user: User) {
    super(user);
    this.twoFactorEnabled = user.twoFactorEnabled;
  }
}
