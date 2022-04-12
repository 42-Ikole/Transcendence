<template>
  <div class="container-fluid pong-margin">
    <h1>PongHub Hub</h1>
    <hr />
    <div v-if="isPlaying">
      <PongGame :observing="isObserving" />
    </div>
    <div v-else-if="isObserving">
      <PongGame :observing="isObserving" />
    </div>
    <div v-else-if="isSearching">
      <!-- TODO: some kind of searching/loading component -->
      <p>Searching...</p>
    </div>
    <div v-else-if="showScoreScreen">
      <ScoreScreen :game-state="gameState" />
      <button @click="showScoreScreen = false">Continue</button>
    </div>
    <div v-else-if="isChallenged">
      <ChallengedRequest />
    </div>
  </div>
</template>

<style>
.pong-margin {
  padding-left: 10% !important;
  padding-right: 10% !important;
  overflow: hidden;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import PongGame from "@/components/Pong/PongGame.vue";
import FindMatch from "@/components/Pong/FindMatch.vue";
import { useUserStore } from "@/stores/UserStore";
import { useSocketStore } from "@/stores/SocketStore";
import ScoreScreen from "../components/Pong/ScoreScreen.vue";
import type { GameState } from "@/components/Pong/PongTypes";
import ActiveGames from "../components/Pong/ActiveGames.vue";
import ChallengeUsers from "../components/Pong/ChallengeUsers.vue";
import ChallengedRequest from "../components/Pong/ChallengedRequest.vue";

export default defineComponent({
  data() {
    return {
      showScoreScreen: false,
      gameState: undefined as GameState | undefined,
    };
  },
  components: {
    PongGame,
    FindMatch,
    ScoreScreen,
    ActiveGames,
    ChallengeUsers,
    ChallengedRequest,
  },
  computed: {
    isPlaying() {
      const userStore = useUserStore();
      return userStore.state === "PLAYING";
    },
    isSearching() {
      return useUserStore().state === "SEARCHING";
    },
    isObserving() {
      return useUserStore().state === "OBSERVING";
    },
    isChallenged() {
      return useUserStore().state === "CHALLENGED";
    },
  },
  methods: {
    endGame(data: GameState) {
      this.gameState = data;
      this.showScoreScreen = true;
    },
  },
  mounted() {
    useSocketStore().pong!.on("endGame", this.endGame);
  },
  unmounted() {
    useSocketStore().pong!.removeListener("endGame", this.endGame);
  },
});
</script>
