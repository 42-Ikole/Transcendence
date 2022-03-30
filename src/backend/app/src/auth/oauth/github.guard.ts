import { Injectable, ExecutionContext } from '@nestjs/common';
import { Strategy } from 'passport-github2';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { SessionUser } from '../auth.types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('oauth.github.CLIENT_ID'),
      clientSecret: configService.get('oauth.github.CLIENT_SECRET'),
      callbackURL: configService.get('oauth.github.CALLBACK_URL'),
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
    const { username, nodeId } = profile;
    const details = { username: username + '_github', intraId: nodeId };
    console.log('Github User:', details);
    const user = await this.authService.validateUser(details);
    callback(null, { id: user.id, twoFactorPassed: !user.twoFactorEnabled });
  }
}

@Injectable()
export class GithubGuard extends AuthGuard('github') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return activate;
  }
}
