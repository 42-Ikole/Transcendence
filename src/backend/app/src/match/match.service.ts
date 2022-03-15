import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from 'src/orm/entities/match.entity';
import { IMatch } from 'src/match/match.interface';


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

  findALL(): Promise<Match[]> {
	  return this.matchRepository.find(); // SELECT * FROM match
  }

  findUserMatches(id: number): Promise<Match[]> {
	  return this.matchRepository.find({where: [{winner: id}, {loser: id}] }) // SELECT * FROM match WHERE winner == id OR loser == id
  }

}
