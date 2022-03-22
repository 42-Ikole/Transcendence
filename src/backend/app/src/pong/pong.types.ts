import { SocketWithUser } from "src/websocket/websocket.types";

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
  username: string;
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
}

export interface GameRoom {
  state: GameState;
  clientOne: SocketWithUser;
  clientTwo: SocketWithUser;
  intervalId: NodeJS.Timer;
}
