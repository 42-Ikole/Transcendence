import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/orm/entities/user.entity';
import { UserService } from 'src/user/user.service';

type Done = (err: Error, user: User) => void;

@Injectable()
export class UserSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  // Encrypt the user into a cookie
  serializeUser(user: User, done: Done) {
    done(null, user);
  }

  async deserializeUser(user: User, done: Done) {
    const userDb = await this.userService.findUser(user);
    return done(null, userDb);
  }
}
