import { Controller, Body, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
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
