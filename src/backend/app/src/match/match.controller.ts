import { Controller, Body, Get, Param, Post, Req, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Match } from 'src/orm/entities/match.entity';
import { MatchService } from 'src/match/match.service';
import { RequestWithUser } from 'src/auth/auth.types';

@ApiTags('match')
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  ////////////
  // Create //
  ////////////

  @Post('create')
  async createMatch(@Body() match: Match): Promise<Match> {
    return this.matchService.createMatch(match);
  }

  /////////////
  // Getters //
  /////////////

  @Get('all')
  async findALL(): Promise<Match[]> {
    return this.matchService.findALL(); // SELECT * FROM match
  }

  @Get('userMatches')
  async findUserMatches(@Req() request: RequestWithUser): Promise<Match[]> {
    return await this.matchService.findUserMatches(request.user.id);
  }
}
