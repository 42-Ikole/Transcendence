export interface Point {
  x: number;
  y: number;
}

export interface PongBar {
  position: Point;
  width: number;
  height: number;
}

export interface SpecialMoves {
  speedUp: boolean;
  grow: boolean;
  shrink: boolean;
}

export interface Player {
  bar: PongBar;
  username: string;
  score: number;
  specialMoves: SpecialMoves;
}

export interface Ball {
  position: Point;
  direction: Point;
  radius: number;
}

export interface GameState {
  playerOne: Player;
  playerTwo: Player;
  ball: Ball;
  default: boolean;
}

interface PongUser {
  userId: number;
  disconnected: boolean;
  pressedKeys: PressedKeys;
}

export interface GameDto {
  state: GameState;
  name: string;
}

export interface GameRoom {
  intervalId: NodeJS.Timer | undefined;
  playerOne: PongUser;
  playerTwo: PongUser;
  observers: Set<number>; // set of userIds
  gameState: GameState;
}

export interface PressedKeys {
  w: boolean;
  s: boolean;
  ArrowUp: boolean;
  ArrowDown: boolean;
  q: boolean;
  r: boolean;
  f: boolean;
}
