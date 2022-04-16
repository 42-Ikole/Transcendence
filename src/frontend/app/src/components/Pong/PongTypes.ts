export interface Point {
  x: number;
  y: number;
}

export interface PongBar {
  position: Point;
  width: number;
  height: number;
}

export interface Player {
  bar: PongBar;
  id: number;
  score: number;
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
