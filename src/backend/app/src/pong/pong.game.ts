import { Ball, GameState, Player, PongBar } from './pong.types';

const BALL_SPEED = 0.005;
const PLAYER_SPEED = 0.025;

type ArrowKey = 'ArrowUp' | 'ArrowDown';

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

function newPlayer(): Player {
  return {
    bar: {
      position: {
        x: 0.01,
        y: 0.4, // 0.5 - bar.height / 2
      },
      width: 0.015,
      height: 0.2,
    },
    score: 0,
  };
}

export function newGameState(): GameState {
  const state: GameState = {
    ball: newBall(),
    playerOne: newPlayer(),
    playerTwo: newPlayer(),
  };
  state.playerTwo.bar.position.x = 0.975; // 0.99 - bar.width
  return state;
}

function resetGameState(state: GameState) {
  const scoreOne = state.playerOne.score;
  const scoreTwo = state.playerTwo.score;
  state.playerOne = newPlayer();
  state.playerTwo = newPlayer();
  state.ball = newBall();
  state.playerTwo.bar.position.x = 0.975; // 0.99 - bar.width
  state.playerOne.score = scoreOne;
  state.playerTwo.score = scoreTwo;
}

export function movePlayer(bar: PongBar, direction: ArrowKey) {
  switch (direction) {
    case 'ArrowUp':
      bar.position.y -= PLAYER_SPEED;
      break;
    case 'ArrowDown':
      bar.position.y += PLAYER_SPEED;
      break;
    default:
      throw new Error('invalid player movement direction: ' + direction);
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
    bar.position.y - ball.radius <= bar.position.y + bar.height
  );
}

function updateBallPosition(state: GameState) {
  state.ball.position.x += state.ball.direction.x * BALL_SPEED;
  state.ball.position.y += state.ball.direction.y * BALL_SPEED;
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

export function updateGamestate(state: GameState): GameState {
  updateBallPosition(state);
  if (roundHasEnded(state)) {
    handleRoundEnd(state);
  }
  return state;
}
