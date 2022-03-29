import { ConfigService } from '@nestjs/config';
import { SessionUser } from 'src/auth/auth.types';
import { parse } from 'cookie';
import * as cookieParser from 'cookie-parser';
import { getRepository } from 'typeorm';
import { TypeORMSession } from 'src/orm/entities/session.entity';
import { TypeormStore } from 'connect-typeorm/out';
import * as util from 'util';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

// TODO: more error checks
async function decodeCookie(
  cookie: string,
  configService: ConfigService,
): Promise<SessionUser | null> {
  // `cookie.parse` to parse cookie from HTTP header field
  const parsedCookie = parse(cookie);
  // Server-side options: the name/secret we generated the cookie with
  const name = configService.get('cookie.NAME');
  const secret = configService.get('cookie.SECRET');
  // We now have an Express-Session generated cookie, so we can use the Express parser to retrieve the SID
  const SID = cookieParser.signedCookie(parsedCookie[name], secret);
  if (!SID) {
    throw new Error('invalid cookie');
  }
  // Connect to the Session DB (typeorm) to retrieve the session usin the SID
  const store = new TypeormStore().connect(getRepository(TypeORMSession));
  const session = await util.promisify(store.get)(SID);
  if (!session?.passport?.user) {
    return null;
  }
  return session.passport.user;
}

@Injectable()
export class CookieService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async userFromCookie(cookie: string) {
    const sessionUser: SessionUser = await decodeCookie(
      cookie,
      this.configService,
    );
    if (!sessionUser) {
      return null;
    }
    const user = await this.userService.findById(sessionUser.id);
    return user;
  }
}
