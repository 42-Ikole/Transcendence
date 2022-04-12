import { Ball, GameState, Player, PongBar, SpecialMoves } from './pong.types';

/*
Concept: all coordinates are in range [0, 1] and used in the frontend as a percentage relative to the screen size.
So position `x = 0.5` is half of the screen/game width in the frontend.
*/

// TODO: add BALL acceleration and key input (like space) for some special move
//
const BALL_SPEED = 0.01;
const PLAYER_SPEED = 0.01;
const VERTICAL_FACTOR = 0.4;
const BAR_SHRINK = 0.006;
const BAR_CORRECTION = 0.003;
const SPEEDUP = 1.2;

function newBall(): Ball {
  return {
    position: {
      x: 0.5,
      y: 0.5,
    },
    direction: {
      x: Math.random() < 0.5 ? -1 : 1,
      y:
        Math.random() < 0.5
          ? Math.random() * -VERTICAL_FACTOR
          : Math.random() * VERTICAL_FACTOR,
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
    specialMoves: {
      speedUp: false,
      grow: false,
      shrink: false,
    },
  };
}

export function newGameState(
  userOne: string,
  userTwo: string,
  mode: boolean,
): GameState {
  const state: GameState = {
    ball: newBall(),
    playerOne: newPlayer(userOne),
    playerTwo: newPlayer(userTwo),
    default: mode,
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

// directions is an array of pressed keys, add functionality
export function movePlayer(bar: PongBar, directions: Array<string>) {
  for (const item of directions) {
    if (item === 'ArrowUp' || item === 'w') {
      bar.position.y -= PLAYER_SPEED;
    }
    if (item === 'ArrowDown' || item === 's') {
      bar.position.y += PLAYER_SPEED;
    }
  }
  // so that the bar doesn't go beyond the edge (top/bottom)
  if (bar.position.y > 1 - bar.height) {
    bar.position.y = 1 - bar.height;
  } else if (bar.position.y < 0) {
    bar.position.y = 0;
  }
}

export function specialMoves(state: GameState) {
  if (
    (state.playerOne.specialMoves.grow === false &&
      state.playerTwo.specialMoves.shrink === true) ||
    (state.playerOne.specialMoves.shrink === true &&
      state.playerTwo.specialMoves.grow === false)
  ) {
    state.ball.radius = 0.0075;
  } else if (
    (state.playerOne.specialMoves.grow === true &&
      state.playerTwo.specialMoves.shrink === false) ||
    (state.playerOne.specialMoves.shrink === false &&
      state.playerTwo.specialMoves.grow === true)
  ) {
    state.ball.radius = 0.025;
  } else {
    state.ball.radius = 0.015;
  }
}

export function checkSpecialMoves(special: SpecialMoves, keys: Array<string>) {
  special.speedUp = false;
  special.grow = false;
  special.shrink = false;
  for (const item of keys) {
    if (item === 'q') {
      special.speedUp = true;
    } else if (item === 'r') {
      special.grow = true;
    } else if (item === 'f') {
      special.shrink = true;
    }
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

function ballBarDirection(ball: Ball, bar: PongBar, mode: boolean) {
  ball.direction.x *= -1;
  const offset = ball.position.y - bar.position.y - bar.height / 2;
  ball.direction.y += ((offset / (bar.height / 2)) * 1.2) / 2;
  if (bar.height > 0.025 && mode == false) {
    bar.height -= BAR_SHRINK;
    bar.position.y += BAR_CORRECTION;
  }
}

function ballBarIntersection(ball: Ball, bar: PongBar, mode: boolean) {
  if (
    ball.position.x + ball.radius >= bar.position.x &&
    ball.position.x - ball.radius <= bar.position.x + bar.width &&
    ball.position.y + ball.radius >= bar.position.y &&
    ball.position.y - ball.radius <= bar.position.y + bar.height
  ) {
    ballBarDirection(ball, bar, mode);
  }
}

function updateBallPosition(state: GameState) {
  if (
    (state.playerOne.specialMoves.speedUp === true ||
      state.playerTwo.specialMoves.speedUp === true) &&
    state.default === false
  ) {
    state.ball.position.x += state.ball.direction.x * SPEEDUP * BALL_SPEED;
  } else {
    state.ball.position.x += state.ball.direction.x * BALL_SPEED;
  }
  state.ball.position.y += state.ball.direction.y * BALL_SPEED;
  if (state.ball.position.y - state.ball.radius <= 0 || state.ball.position.y + state.ball.radius >= 1) {
    state.ball.direction.y *= -1;
    if (state.default == false && state.ball.position.y <= 0) {
      state.ball.radius += 0.001;
    } else if (state.default == false && state.ball.position.y >= 1) {
      state.ball.radius -= 0.001;
    }
  }
  ballBarIntersection(state.ball, state.playerOne.bar, state.default);
  ballBarIntersection(state.ball, state.playerTwo.bar, state.default);
}

export function gameHasEnded(state: GameState): boolean {
  return (
    (state.playerOne.score >= 11 || state.playerTwo.score >= 11) &&
    Math.abs(state.playerOne.score - state.playerTwo.score) > 1
  );
}

export function updateGamestate(state: GameState): GameState {
  updateBallPosition(state);
  if (roundHasEnded(state)) {
    handleRoundEnd(state);
  }
  return state;
}
