<template>
  <h3>Game Result</h3>
  <p>{{ gameState?.playerOne.username }}: {{ gameState?.playerOne.score }}</p>
  <p>{{ gameState?.playerTwo.username }}: {{ gameState?.playerTwo.score }}</p>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { GameState } from "./PongTypes";

export default defineComponent({
  props: {
    gameState: {
      type: Object as PropType<GameState>,
      required: false,
    },
  },
});
</script>
