import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Match } from 'src/orm/entities/match.entity';
import { IMatch } from 'src/match/match.interface';
import { MatchStats } from './match.types';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match) private matchRepository: Repository<Match>,
  ) {}

  ////////////
  // Create //
  ////////////

  createMatch(matchDTO: IMatch): Promise<Match> {
    // creates user entity
    const newMatch = this.matchRepository.create(matchDTO);

    // inserts if not exists
    return this.matchRepository.save(newMatch);
  }

  /////////////
  // Getters //
  /////////////

  async findAll(options?: FindManyOptions<Match>): Promise<Match[]> {
    return this.matchRepository.find(options);
  }

  async findUserMatches(id: number): Promise<Match[]> {
    return this.findAll({
      where: [{ winner: id }, { loser: id }],
    }); // SELECT * FROM match WHERE winner == id OR loser == id
  }

  async createStats(id: number): Promise<MatchStats> {
    const wonMatches = await this.findAll({ where: [{ winner: id }] });
    const lostMatches = await this.findAll({ where: [{ loser: id }] });
    const stats: MatchStats = {
      winCount: wonMatches.length,
      lossCount: lostMatches.length,
      rating: 0,
    };
    const delta = 10 * (stats.winCount - stats.lossCount);
    stats.rating = Math.max(0, 2000 + delta);
    return stats;
  }
}
