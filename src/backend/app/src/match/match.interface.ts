import { User } from 'src/orm/entities/user.entity';

export interface IMatch {
  winner: User;
  winnerScore: number;
  loser: User;
  loserScore: number;
}
