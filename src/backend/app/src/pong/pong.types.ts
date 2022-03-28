import { SocketWithUser } from 'src/websocket/websocket.types';

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

interface PongUser {
  socketId: string;
  userId: number;
  disconnected: boolean;
}

export interface GameDto {
  state: GameState;
  name: string;
}

export interface GameRoom {
  intervalId: NodeJS.Timer;
  playerOne: PongUser;
  playerTwo: PongUser;
  observers: Set<string>; // set of socketIds
  gameState: GameState;
}
