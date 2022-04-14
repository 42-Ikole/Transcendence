<template>
  <div class="text-center">
    <h3>Game Result</h3>
    <p>{{ playerOneName }}: {{ playerOneScore }}</p>
    <p>{{ playerTwoName }}: {{ playerTwoScore }}</p>
    <button class="btn btn-outline-light" @click="exitScoreScreen">
      Continue
    </button>
  </div>
</template>

<script lang="ts">
import { useSocketStore } from "@/stores/SocketStore";
import { defineComponent, type PropType } from "vue";
import type { GameState } from "./PongTypes";

export default defineComponent({
  props: {
    gameState: {
      type: Object as PropType<GameState | undefined>,
      required: false,
    },
  },
  computed: {
    playerOneName() {
      if (!this.gameState) {
        return "unknown";
      }
      return this.gameState.playerOne.username;
    },
    playerTwoName() {
      if (!this.gameState) {
        return "unknown";
      }
      return this.gameState.playerTwo.username;
    },
    playerOneScore() {
      if (!this.gameState) {
        return 0;
      }
      return this.gameState.playerOne.score;
    },
    playerTwoScore() {
      if (!this.gameState) {
        return 0;
      }
      return this.gameState.playerTwo.score;
    },
  },
  methods: {
    exitScoreScreen() {
      useSocketStore().pong!.emit("exitScoreScreen");
    },
  },
});
</script>
