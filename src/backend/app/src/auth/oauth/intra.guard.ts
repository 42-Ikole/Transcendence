import { Injectable, ExecutionContext } from '@nestjs/common';
import { Strategy } from 'passport-42';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { SessionUser } from '../auth.types';
import { ConfigService } from '@nestjs/config';
import { downloadAvatar } from './getAvatar';
import { HttpService } from '@nestjs/axios';
import { UserService } from 'src/user/user.service';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private httpService: HttpService,
    private userService: UserService,
  ) {
    super({
      clientID: configService.get('oauth.intra.CLIENT_ID'),
      clientSecret: configService.get('oauth.intra.CLIENT_SECRET'),
      callbackURL: configService.get('oauth.intra.CALLBACK_URL'),
      profileFields: {
        id: function (obj) {
          return String(obj.id);
        },
        username: 'login',
        avatar: 'image_url',
      },
    });
  }

  /*
	Store user in DB if not existant, save refreshToken for later usage
	Return the user object or call a callback function (which would be the fourth argument)
	*/
  async validate(
    access_token: string, // can be used to access API
    refreshToken: string, // can be stored for refreshing access token
    profile: any,
    callback: (error: any, user: SessionUser) => void,
  ) {
    console.log(profile);
    const { username, id: intraId, avatar } = profile;
    const details = { username, intraId };
    console.log('Intra User:', details);
    const user = await this.authService.validateUser(details);
    console.log(avatar);
    if (avatar) {
      await this.downloadIntraAvatar(user.id, avatar);
    }
    callback(null, { id: user.id, twoFactorPassed: !user.twoFactorEnabled });
  }

  private async downloadIntraAvatar(id: number, avatar: string) {
    const buffer: Buffer = await downloadAvatar(avatar, this.httpService);
    await this.userService.addAvatar(id, { filename: avatar, data: buffer });
  }
}

@Injectable()
export class IntraGuard extends AuthGuard('42') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return activate;
  }
}
