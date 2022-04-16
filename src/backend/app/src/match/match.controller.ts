import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Match } from 'src/orm/entities/match.entity';
import { MatchService } from 'src/match/match.service';

@ApiTags('match')
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  /////////////
  // Getters //
  /////////////

  @Get('all')
  async findAll(): Promise<Match[]> {
    return this.matchService.findAll(); // SELECT * FROM match
  }

  @Get('userMatches/:id')
  async findUserMatches(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Match[]> {
    return await this.matchService.findUserMatches(id);
  }

  @Get('stats/:id')
  async getUserStats(@Param('id', ParseIntPipe) id: number) {
    return await this.matchService.createStats(id);
  }
}
