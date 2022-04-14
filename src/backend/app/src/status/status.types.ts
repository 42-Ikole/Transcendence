import { IsInt } from 'class-validator';

// NULL or MISSING === OFFLINE
export type UserState =
  | 'OFFLINE'
  | 'ONLINE'
  | 'SEARCHING'
  | 'PLAYING'
  | 'OBSERVING'
  | 'CHALLENGED'
  | 'CHALLENGING'
  | 'VIEWING_SCORE_SCREEN'
  | 'CONNECTION_DENIED';

  // TODO: remove array
export const USER_STATES: UserState[] = [
  'OFFLINE',
  'ONLINE',
  'SEARCHING',
  'PLAYING',
  'OBSERVING',
  'CHALLENGED',
  'CONNECTION_DENIED',
];

export class UserIdDto {
  @IsInt()
  id: number;
}
