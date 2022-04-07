// NULL or MISSING === OFFLINE
export type UserState =
  | 'OFFLINE'
  | 'ONLINE'
  | 'SEARCHING'
  | 'PLAYING'
  | 'OBSERVING'
  | 'CHALLENGED'
  | 'CONNECTION_DENIED';

export const USER_STATES: UserState[] = [
  'OFFLINE',
  'ONLINE',
  'SEARCHING',
  'PLAYING',
  'OBSERVING',
  'CHALLENGED',
  'CONNECTION_DENIED',
];
