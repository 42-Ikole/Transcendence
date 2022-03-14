import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from 'src/orm/entities/match.entity';
import { IMatch } from 'src/match/match.interface';

function validateNumber(num: string): void {
  if (isNaN(parseInt(num))) {
    console.log('validateNumber: throwing exception...');
    throw new HttpException(
      'invalid parameter: expected number: [' + num + ']',
      HttpStatus.BAD_REQUEST,
    );
  }
}

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match) private matchRepository: Repository<Match>,
  ) {}

}
