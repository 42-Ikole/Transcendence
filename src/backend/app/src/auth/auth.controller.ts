import { Controller, Delete, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { IntraGuard } from './oauth/intra.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestWithUser, AuthenticatedState } from './auth.types';
import { OAuthGuard } from 'src/2FA/oauth.guard';
import { AuthenticatedGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';
import { GithubGuard } from './oauth/github.guard';
import { DiscordGuard } from './oauth/discord.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private configService: ConfigService) {}

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
  @Get('status')
  status(@Req() req: RequestWithUser) {
    let state: AuthenticatedState;
    if (!req.isAuthenticated()) {
      state = 'OAUTH';
    } else if (!req.user.twoFactorPassed) {
      state = '2FA';
    } else {
      state = 'AUTHENTICATED';
    }
    return { state };
  }

  @ApiOperation({ summary: 'Logs the user out and kills the session.' })
  @Delete('logout')
  @UseGuards(OAuthGuard)
  logout(@Req() req: Request) {
    req.logout();
    req.session.destroy((error) => {
      if (error) {
        console.error(error);
      }
    });
  }

  @ApiOperation({ summary: 'to test if user is completely authenticated' })
  @Get('test')
  @UseGuards(AuthenticatedGuard)
  test() {
    return 'OK';
  }
}
