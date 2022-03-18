<template>
	<div>
		<canvas id="canvas" ref="game" width="640" height="480"></canvas>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";

interface Data {
	socket: null | Socket;
	position: {
		x: number;
		y: number;
	};
	context: any;
};

export default defineComponent({
	data(): Data {
		return {
			socket: null,
			position: { x: 0, y: 0 },
			context: {},
		}
	},
	methods: {
		renderRectangle() {
			this.context.clearRect(0, 0, this.$refs.game.width, this.$refs.game.height);
			this.context.fillRect(this.position.x, this.position.y, 20, 20);
		},
		updatePosition(data: any) {
			console.log("Updating:", data);
			this.position = data;
		},
		move(data: any) {
			const keys = [ "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight" ];
			if (keys.includes(data.key)) {
				console.log("move:", data);
				this.socket!.emit('updatePosition', data.key);
			}
		},
	},
	created() {
		this.socket = io('http://localhost:3000/pong');
		this.socket.on('updatePosition', (data: any) => {
			this.updatePosition(data);
			this.renderRectangle();
		});
		window.addEventListener('keydown', this.move);
	},
	mounted() {
		this.context = (this.$refs as any).game.getContext("2d");
	},
	unmounted() {
		window.removeEventListener('keydown', this.move);
	}
});
</script>

<style>
	#canvas {
		background-color: white;
		border: 1px solid black;
	}
</style>
