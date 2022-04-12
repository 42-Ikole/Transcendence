import { User } from 'src/orm/entities/user.entity';

export type ModeType = "DEFAULT" | "SPECIAL"

export interface IMatch {
  winner: User;
  winnerScore: number;
  loser: User;
  loserScore: number;
  mode: ModeType;
}
