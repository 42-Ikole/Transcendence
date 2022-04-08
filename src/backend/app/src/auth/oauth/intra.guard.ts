import { Injectable, ExecutionContext } from '@nestjs/common';
import { Strategy } from 'passport-42';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { SessionUser } from '../auth.types';
import { ConfigService } from '@nestjs/config';
import { downloadAvatar } from './getAvatar';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private httpService: HttpService,
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
        image_url: 'image_url',
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
    const { username, id: intraId, image_url: avatar } = profile;
    const details = { username, intraId, avatar };
    const imageData = await downloadAvatar(avatar, this.httpService);
    console.log('Intra User:', details);
    const user = await this.authService.validateUser(details);
    callback(null, { id: user.id, twoFactorPassed: !user.twoFactorEnabled });
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
