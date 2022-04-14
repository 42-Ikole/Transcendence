import type { PublicUser } from "./UserType";

export interface Match {
  id: number;
  winner: PublicUser;
  winnerScore: number;
  loser: PublicUser;
  loserScore: number;
  createdDate: Date;
}
