import { Injectable, ExecutionContext } from '@nestjs/common';
import { Strategy } from 'passport-discord';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { SessionUser } from '../auth.types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('oauth.discord.CLIENT_ID'),
      clientSecret: configService.get('oauth.discord.CLIENT_SECRET'),
      callbackURL: configService.get('oauth.discord.CALLBACK_URL'),
      scope: ["identify"],
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
    const { username, id: intraId } = profile;
    const details = { username: username + "_discord" , intraId };
    console.log('Discord User:', details);
    const user = await this.authService.validateUser(details);
    callback(null, { id: user.id, twoFactorPassed: !user.twoFactorEnabled });
  }
}

@Injectable()
export class DiscordGuard extends AuthGuard('discord') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return activate;
  }
}
