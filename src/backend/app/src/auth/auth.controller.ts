import { Controller, Delete, Get, Req, Res, UseGuards, Post } from '@nestjs/common';
import { Response } from 'express';
import { IntraGuard } from './oauth/intra.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestWithUser, AuthenticatedState } from './auth.types';
import { OAuthGuard } from 'src/2FA/oauth.guard';
import { AuthenticatedGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';
import { GithubGuard } from './oauth/github.guard';
import { DiscordGuard } from './oauth/discord.guard';
import { SocketService } from 'src/websocket/socket.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private socketService: SocketService) {}

  @Get('login/intra')
  @UseGuards(IntraGuard)
  async loginIntra(@Res() res: Response) {
    res.redirect(this.configService.get('oauth.REDIRECT_URL'));
  }

  @Get('login/github')
  @UseGuards(GithubGuard)
  async loginGithub(@Res() res: Response) {
    res.redirect(this.configService.get('oauth.REDIRECT_URL'));
  }

  @Get('login/discord')
  @UseGuards(DiscordGuard)
  async loginDiscord(@Res() res: Response) {
    res.redirect(this.configService.get('oauth.REDIRECT_URL'));
  }

  @ApiOperation({
    summary:
      'Returns the current state of authentication: "AUTHENTICATED" | "2FA" | "OAUTH"',
  })
  @Post('status')
  status(@Req() req: RequestWithUser) {
    let state: AuthenticatedState;
    if (!req.isAuthenticated()) {
      state = 'OAUTH';
    } else if (!req.user.twoFactorPassed) {
      state = '2FA';
    } else if (req.user.username === null) {
      state = 'ACCOUNT_SETUP';
    } else {
      state = 'AUTHENTICATED';
    }
    return { state };
  }

  @ApiOperation({ summary: 'Logs the user out and kills the session.' })
  @Delete('logout')
  @UseGuards(OAuthGuard)
  async logout(@Req() req: RequestWithUser) {
    if (!req.session) {
      return;
    }
    if (req.user) {
      this.socketService.disconnectUser(req.user.id);
    }
    req.logout();
    req.session.cookie.maxAge = 0;
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  @ApiOperation({ summary: 'to test if user is completely authenticated' })
  @Get('test')
  @UseGuards(AuthenticatedGuard)
  test() {
    return 'OK';
  }
}
