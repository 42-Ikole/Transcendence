<template>
  <p> {{ playerOneScore }}  : {{ playerTwoScore }} </p>
  <canvas class="game" ref="game" width="600" height="480"> </canvas>
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
  context: CanvasRenderingContext2D | null;
  playerOneScore: number;
  playerTwoScore: number;
  PressedKeys: Boolean[];
}

export default defineComponent({
  data(): DataObject {
    return {
      context: null,
      playerOneScore: 0,
      playerTwoScore: 0,
      PressedKeys: [false, false],
    };
  },
  computed: {
    width() {
      return (this.$refs as any).game.width;
    },
    height() {
      return (this.$refs as any).game.height;
    },
    ...mapState(useSocketStore, {
      socket: "pong",
    }),
  },
  methods: {
    update(data: GameState) {
      if (!data) {
        console.log("gamestate data is NULL");
        return;
      }
      this.socket!.emit('movement', this.PressedKeys);
      this.render(data);
      this.playerOneScore = data.playerOne.score;
      this.playerTwoScore = data.playerTwo.score;
    },
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
        bar.height * this.height
      );
    },
    drawBall(ball: Ball) {
      this.context!.beginPath();
      this.context!.fillStyle = "#000";
      this.context!.arc(
        ball.position.x * this.width,
        ball.position.y * this.height,
        ball.radius * this.width,
        0,
        2 * Math.PI
      );
      this.context!.fill();
    },
    keyDown(data: any) {
      if (data.key === "ArrowUp") {
        this.PressedKeys[0] = true;
      } else if (data.key === "ArrowDown") {
        this.PressedKeys[1] = true;
      }
    },
    keyUp(data: any) {
      if (data.key === "ArrowUp") {
        this.PressedKeys[0] = false;
      } else if (data.key === "ArrowDown") {
        this.PressedKeys[1] = false;
      }
    },
    clear() {
      this.context!.clearRect(0, 0, this.width, this.height);
    },
  },
  mounted() {
    console.log("FE: Setting up PongGame");
    this.context = (this.$refs as any).game.getContext("2d");
    this.socket!.on("updatePosition", this.update);
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("keyup", this.keyUp);
  },
  unmounted() {
    console.log("FE: Unmounting PongGame");
    window.removeEventListener("keydown", this.keyDown);
    window.removeEventListener("keyup", this.keyUp);
  },
});
</script>

<style>
.game {
  width: 50vw;
  height: 80vh;
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
