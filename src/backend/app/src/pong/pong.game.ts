import { Ball, GameState, Player, PongBar } from "./pong.types"

const BALL_SPEED = 0.25;
const PLAYER_SPEED = 0.05;

type ArrowKey = "ArrowUp" | "ArrowDown"

function resetBall(ball: Ball) {
	ball.position.x = 0.5;
	ball.position.y = 0.5;
	ball.direction.x = -1;
	ball.direction.y = 0;
	ball.radius = 0.01;
}

function resetPlayer(player: Player) {
	player.bar.position.y = 0.5;
	player.bar.position.x = 0.1;
	player.bar.width = 0.01; // 1% of screen width
	player.bar.height = 0.1; // 10% of screen height
	player.score = 0;
}

export function resetGameState(state: GameState) {
	resetBall(state.ball);
	resetPlayer(state.playerOne);
	resetPlayer(state.playerTwo);
	state.playerTwo.bar.position.x = 0.9;
}

export function movePlayer(bar: PongBar, direction: ArrowKey) {
	switch (direction) {
		case "ArrowUp":
			bar.position.y += PLAYER_SPEED;
			break;
		case "ArrowDown":
			bar.position.y -= PLAYER_SPEED;
			break;
		default:
			throw new Error("invalid player movement direction: " + direction);
	}
	if (bar.position.y > 1) {
		bar.position.y = 1;
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
	return ball.position.x == bar.position.x
		&& (ball.position.y >= bar.position.y
		&& bar.position.y <= bar.position.y + bar.height);
}

function updateBallPosition(state: GameState) {
	state.ball.position.x += state.ball.direction.x * BALL_SPEED;
	state.ball.position.y += state.ball.direction.y * BALL_SPEED;
	if (state.ball.position.y <= 0 || state.ball.position.y >= 1) {
		state.ball.direction.y *= -1;
	}
	if (ballBarIntersection(state.ball, state.playerOne.bar) || ballBarIntersection(state.ball, state.playerTwo.bar)) {
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
