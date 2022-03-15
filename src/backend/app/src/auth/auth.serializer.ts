import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/orm/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { SessionUser } from './auth.types';

type Done = (err: Error, user: User) => void;

@Injectable()
export class UserSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  // Encrypt the user into a cookie
  serializeUser(
    user: SessionUser,
    done: (err: Error, user: SessionUser) => void,
  ) {
    done(null, user);
  }

  async deserializeUser(user: SessionUser, done: Done) {
    const userDb = await this.userService.findOne(user.id);
    (userDb as any).twoFactorPassed = user.twoFactorPassed;
    return done(null, userDb);
  }
}
