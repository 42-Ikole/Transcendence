<template>
  <p> {{ playerOneScore }}  : {{ playerTwoScore }} </p>
  <canvas class="game" ref="game" width="480" height="600"> </canvas>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { Ball, GameState, PongBar } from "./PongTypes";
import { mapState } from "pinia";
import { useUserStore } from "@/stores/UserStore";
import { useSocketStore } from "@/stores/SocketStore";

interface DataObject {
  context: null | CanvasRenderingContext2D;
  game: null | GameState;
  width: number;
  height: number;
  playerOneScore: number;
  playerTwoScore: number;
}

let rendering = false;

const PressedKeys = [false, false];

export default defineComponent({
  data(): DataObject {
    return {
      context: null,
      game: null,
      width: 0,
      height: 0,
      playerOneScore: 0,
      playerTwoScore: 0,
    };
  },
  methods: {
    update() {
      // this.socket.emit('requestUpdate');
      this.socket.emit('movement', PressedKeys);
      if (rendering) {
        window.requestAnimationFrame(this.update);
      }
    },
    render(data: GameState) {
      this.clear();
      this.drawBar(data.playerOne.bar);
      this.drawBar(data.playerTwo.bar);
      this.drawBall(data.ball);
    },
    drawBar(bar: PongBar) {
      this.context.fillStyle = "#000";
      this.context.fillRect(
        bar.position.x * this.width,
        bar.position.y * this.height,
        bar.width * this.width,
        bar.height * this.height
      );
    },
    drawBall(ball: Ball) {
      this.context.beginPath();
      this.context.fillStyle = "#000";
      this.context.arc(
        ball.position.x * this.width,
        ball.position.y * this.height,
        ball.radius * this.width,
        0,
        2 * Math.PI
      );
      this.context.fill();
    },
    keyDown(data: any) {
      if (data.key === "ArrowUp") {
        PressedKeys[0] = true;
      } else if (data.key === "ArrowDown") {
        PressedKeys[1] = true;
      }
    },
    keyUp(data: any) {
      if (data.key === "ArrowUp") {
        PressedKeys[0] = false;
      } else if (data.key === "ArrowDown") {
        PressedKeys[1] = false;
      }
    },
    clear() {
      this.context.clearRect(0, 0, this.game.width, this.game.height);
    },
  },
  created() {
    this.socket.on("updatePosition", (data: GameState) => {
      if (!data) {
        console.log("data is NULL");
        return;
      }
      this.render(data);
      this.playerOneScore = data.playerOne.score
      this.playerTwoScore = data.playerTwo.score
    });
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("keyup", this.keyUp);
  },
  mounted() {
    this.game = this.$refs.game;
    this.width = this.game.width;
    this.height = this.game.height;
    this.context = this.game.getContext("2d");
    window.requestAnimationFrame(this.update);
    rendering = true;
  },
  unmounted() {
    window.removeEventListener("keydown", this.move);
    rendering = false;
  },
  computed: {
    ...mapState(useSocketStore, {
      socket: "pong",
    }),
  },
});
</script>

<style>
.game {
  width: 600px;
  height: 480px;
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
