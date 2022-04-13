import {
  Controller,
  Body,
  Get,
  Param,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Match } from 'src/orm/entities/match.entity';
import { MatchService } from 'src/match/match.service';

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

  @Get('userMatches/:id')
  async findUserMatches(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Match[]> {
    return await this.matchService.findUserMatches(id);
  }
}
