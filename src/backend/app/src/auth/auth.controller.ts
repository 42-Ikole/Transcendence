import { Controller, Delete, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticatedGuard } from './auth.guard';
import { IntraGuard } from './intra.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('OAuth')
@Controller('auth')
export class AuthController {
  @ApiOperation({ summary: 'This endpoint redirects the user to 42 to login.' })
  @Get('login')
  @UseGuards(IntraGuard)
  async login() {
    return;
  }

  @ApiOperation({
    summary:
      'The endpoint that the OAuth provider (42) redirects to, we return the user back to the frontend.',
  })
  @Get('redirect')
  @UseGuards(IntraGuard)
  async redirect(@Res() res: Response) {
    res.redirect('http://localhost:8080');
  }

  @ApiOperation({
    summary:
      "Returns a 403 (forbidden) status code if not logged in, otherwise returns the user's data.",
  })
  @Get('status')
  @UseGuards(AuthenticatedGuard)
  status(@Req() req: Request) {
    return req.user;
  }

  @ApiOperation({ summary: 'Logs the user out and kills the session.' })
  @Delete('logout')
  @UseGuards(AuthenticatedGuard)
  logout(@Req() req: Request) {
    req.logout();
  }
}
