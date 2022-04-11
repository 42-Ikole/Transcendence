<template>
  <div class="text-center">
    <h2 class="p1-score inline">{{ playerOneScore }}</h2>
    <h2 class="inline">:</h2>
    <h2 class="inline p2-score">{{ playerTwoScore }}</h2>
  </div>
  <canvas class="game" ref="game" width="600" height="480"> </canvas>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Ball, GameState, PongBar } from "./PongTypes";
import { mapState } from "pinia";
import { useSocketStore } from "@/stores/SocketStore";

interface DataObject {
  context: CanvasRenderingContext2D | null;
  playerOneScore: number;
  playerTwoScore: number;
  PressedKeys: Set<string>;
}

export default defineComponent({
  props: {
    observing: Boolean,
  },
  data(): DataObject {
    return {
      context: null,
      playerOneScore: 0,
      playerTwoScore: 0,
      PressedKeys: new Set<string>(),
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
    updatePlayer(data: GameState) {
      this.socket!.emit("movement", Array.from(this.PressedKeys));
      this.updateObserver(data);
    },

    updateObserver(data: GameState) {
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
      this.context!.fillStyle = "#ff80fd";
      this.context!.fillRect(
        bar.position.x * this.width,
        bar.position.y * this.height,
        bar.width * this.width,
        bar.height * this.height
      );
    },

    drawBall(ball: Ball) {
      this.context!.beginPath();
      this.context!.fillStyle = "#ffe32e";
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
      this.PressedKeys.add(data.key);
      console.log("->", data.key, "<-");
    },

    keyUp(data: any) {
      this.PressedKeys.delete(data.key);
    },

    clear() {
      this.context!.clearRect(0, 0, this.width, this.height);
    },
  },

  mounted() {
    console.log("FrontEnd: Setting up PongGame");
    this.context = (this.$refs as any).game.getContext("2d");
    if (!this.observing) {
      window.addEventListener("keydown", this.keyDown);
      window.addEventListener("keyup", this.keyUp);
      this.socket!.on("updatePosition", this.updatePlayer);
    } else {
      this.socket!.on("updatePosition", this.updateObserver);
    }
  },

  unmounted() {
    console.log("FrontEnd: Unmounting PongGame");
    if (!this.observing) {
      window.removeEventListener("keydown", this.keyDown);
      window.removeEventListener("keyup", this.keyUp);
      this.socket!.removeListener("updatePosition", this.updatePlayer);
    } else {
      this.socket!.removeListener("updatePosition", this.updateObserver);
    }
  },
});
</script>

<style>
.game {
  width: 60vw;
  height: 80vh;
  border-top: 5px solid black;
  border-bottom: 5px solid black;
  border-left: 8px solid #b52b24;
  border-right: 8px solid #32a852;
  display: block;
  background-color: white;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url("@/assets/new\ coders.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.p1-score {
  color: #b52b24;
}

.p2-score {
  color: #32a852;
}

.inline {
  display: inline !important;
}
</style>
