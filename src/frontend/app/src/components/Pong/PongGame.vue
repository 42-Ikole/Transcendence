<template>
<!-- <div class="game"> -->
	<canvas class="game" ref="game"></canvas>
	<!-- <div class="ball"></div>
	<div class="bar left"></div>
	<div class="bar right"></div> -->
<!-- </div> -->
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	data() {
		return {
			context: null as null | CanvasRenderingContext2D,
			game: null as any,
		};
	},
	methods: {
		update() {
			this.render();
		},
		render() {
			this.clear();
			this.context!.fillStyle = "cyan";
			this.context!.fillRect(10, 50, 5, 50);
		},
		clear() {
			this.context!.clearRect(0, 0, this.game.width, this.game.height);
		},
	},
	mounted() {
		this.game = this.$refs.game;
		this.context = this.game.getContext("2d");
		this.update();
	},
	unmounted() {
		console.log("unmounted");
	}
});
</script>

<style>
:root {
	--hue: 200;
	--saturation: 50%;
	--foreground-color: hsl(var(--hue), var(--saturation), 75%);
	--background-color: hsl(var(--hue), var(--saturation), 20%);
}

.game {
	width: 50vw;
	height: 50vh;
	border: 1px solid black;
	margin: 20px;
	background-color: white;
}

.bar {
	--position: 50;

	position: absolute;
	background-color: var(--foreground-color);
	top: calc(var(--position) * 1vh);
	width: 1vh;
	height: 10vh;
}

.bar.left {
	left: 1vw;
}

.bar.right {
	right: 1vw;
}

.ball {
	--x: 50;
	--y: 50;

	position: absolute;
	background-color: var(--foreground-color);
	left: calc(var(--x) * 1vw);
	top: calc(var(--y) * 1vh);
	transform: translate(-50%, -50%);
	border-radius: 50%;
	width: 2.5vh;
	height: 2.5vh;
}
</style>