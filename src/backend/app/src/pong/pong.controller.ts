import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/auth.types';
import { UserService } from 'src/user/user.service';
import { PongService } from './pong.service';

@ApiTags('pong')
@Controller('pong')
@UseGuards(AuthenticatedGuard)
export class PongController {
  constructor(
    private pongService: PongService,
    private userService: UserService,
  ) {}

  @Get('games')
  getActiveGames() {
    return this.pongService.getActiveGames();
  }

  @Get('challengeData')
  getChallengeData(@Req() request: RequestWithUser) {
    return this.pongService.getChallengeData(request.user.id);
  }

  @Get('status/:roomName')
  getGameStatus(@Param('roomName') roomName: string) {
    if (roomName && this.pongService.gameExists(roomName)) {
      return 'OK';
    } else {
      return 'NOT FOUND';
    }
  }

  // Remove since user endpoint should be used instead
  @Get('users')
  async getAvailableUsers() {
    return await this.userService.findAll();
  }
}
