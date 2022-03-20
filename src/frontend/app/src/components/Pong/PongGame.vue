<template>
	<canvas
		class="game"
		ref="game"
		width="2560"
		height="1720">
	</canvas>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { Ball, GameState, PongBar } from './PongTypes';

export default defineComponent({
	data() {
		return {
			context: null as null | CanvasRenderingContext2D,
			game: null as any,
			socket: null as Socket | null,
			width: 0,
			height: 0,
		};
	},
	methods: {
		render(data: GameState) {
			this.clear();
			this.drawBar(data.playerOne.bar);
			this.drawBar(data.playerTwo.bar);
			this.drawBall(data.ball);
		},
		drawBar(bar: PongBar) {
			this.context!.fillStyle = "#000";
			this.context!.fillRect(
				bar.position.x * this.width,
				bar.position.y * this.height,
				bar.width * this.width,
				bar.height * this.height);
		},
		drawBall(ball: Ball) {
			this.context!.beginPath();
			this.context!.fillStyle = "#000";
			this.context!.arc(
				ball.position.x * this.width,
				ball.position.y * this.height,
				ball.radius * this.width,
				0, 2 * Math.PI);
			this.context!.fill();
		},
		move(data: any) {
			this.socket!.emit('movement', data.key);
		},
		clear() {
			this.context!.clearRect(0, 0, this.game.width, this.game.height);
		},
	},
	created() {
		this.socket = io('http://localhost:3000/pong');
		this.socket.on('updatePosition', (data: any) => {
			this.render(data);
		});
		window.addEventListener('keydown', this.move);
	},
	mounted() {
		this.game = this.$refs.game;
		this.width = this.game.width;
		this.height = this.game.height;
		this.context = this.game.getContext("2d");
	},
	unmounted() {
		window.removeEventListener('keydown', this.move);
		this.socket!.disconnect();
	}
});
</script>

<style>
.game {
	width: 1280px;
	height: 920px;
	border: 1px solid black;
	display: block;
	position: absolute;
	background-color: white;
	margin: auto;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
}
</style>
