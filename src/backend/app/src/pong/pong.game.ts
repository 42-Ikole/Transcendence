import { Ball, GameState, Player, PongBar } from './pong.types';

const BALL_SPEED = 0.005;
const PLAYER_SPEED = 0.01;

function newBall(): Ball {
  return {
    position: {
      x: 0.5,
      y: 0.5,
    },
    direction: {
      x: -1,
      y: 0,
    },
    radius: 0.015,
  };
}

function newPlayer(username: string): Player {
  return {
    bar: {
      position: {
        x: 0.01,
        y: 0.4, // 0.5 - bar.height / 2
      },
      width: 0.015,
      height: 0.2,
    },
    username: username,
    score: 0,
  };
}

export function newGameState(userOne: string, userTwo: string): GameState {
  const state: GameState = {
    ball: newBall(),
    playerOne: newPlayer(userOne),
    playerTwo: newPlayer(userTwo),
  };
  state.playerTwo.bar.position.x = 0.975; // 0.99 - bar.width
  return state;
}

function resetGameState(state: GameState) {
  const scoreOne = state.playerOne.score;
  const scoreTwo = state.playerTwo.score;
  state.playerOne = newPlayer(state.playerOne.username);
  state.playerTwo = newPlayer(state.playerTwo.username);
  state.ball = newBall();
  state.playerTwo.bar.position.x = 0.975; // 0.99 - bar.width
  state.playerOne.score = scoreOne;
  state.playerTwo.score = scoreTwo;
}

export function movePlayer(bar: PongBar, directions: Boolean[]) {
  if (directions[0]) {
    bar.position.y -= PLAYER_SPEED;
  }
  if (directions[1]) {
    bar.position.y += PLAYER_SPEED;
  }
  if (bar.position.y > 1 - bar.height) {
    bar.position.y = 1 - bar.height;
  } else if (bar.position.y < 0) {
    bar.position.y = 0;
  }
}

function roundHasEnded(state: GameState): boolean {
  return state.ball.position.x <= 0 || state.ball.position.x >= 1;
}

// return true if the game has ended
// assigns score appropriately
function handleRoundEnd(state: GameState) {
  if (state.ball.position.x <= 0) {
    state.playerTwo.score += 1;
  } else if (state.ball.position.x >= 1) {
    state.playerOne.score += 1;
  }
  resetGameState(state);
}

function ballBarIntersection(ball: Ball, bar: PongBar): boolean {
  // right now it's just a square intersection
  return (
    ball.position.x + ball.radius >= bar.position.x &&
    ball.position.x - ball.radius <= bar.position.x + bar.width &&
    ball.position.y + ball.radius >= bar.position.y &&
    ball.position.y - ball.radius <= bar.position.y + bar.height
  );
}

function updateBallPosition(state: GameState, delta: number) {
  state.ball.position.x += state.ball.direction.x * BALL_SPEED * delta;
  state.ball.position.y += state.ball.direction.y * BALL_SPEED * delta;
  if (state.ball.position.y <= 0 || state.ball.position.y >= 1) {
    state.ball.direction.y *= -1;
  }
  if (
    ballBarIntersection(state.ball, state.playerOne.bar) ||
    ballBarIntersection(state.ball, state.playerTwo.bar)
  ) {
    state.ball.direction.x *= -1;
  }
}

// delta is the interval in miliseconds
export function updateGamestate(state: GameState, delta: number): GameState {
  updateBallPosition(state, delta * 0.1);
  if (roundHasEnded(state)) {
    handleRoundEnd(state);
  }
  return state;
}
