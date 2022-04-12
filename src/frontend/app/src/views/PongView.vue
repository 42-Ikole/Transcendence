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
      <SearchingComponent />
    </div>
    <div v-else-if="isChallenging">
      <ChallengingComponent />
    </div>
    <div v-else-if="isViewingScoreScreen">
      <ScoreScreen :game-state="gameState" />
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
import { useFriendStore } from "@/stores/FriendStore";
import ChallengingComponent from "../components/Pong/ChallengingComponent.vue";
import SearchingComponent from "../components/Pong/SearchingComponent.vue";

interface DataObject {
  showScoreScreen: boolean;
  gameState: GameState | undefined;
}

export default defineComponent({
  data(): DataObject {
    return {
      showScoreScreen: false,
      gameState: undefined,
    };
  },
  components: {
    PongGame,
    FindMatch,
    ScoreScreen,
    ActiveGames,
    ChallengeUsers,
    ChallengedRequest,
    ChallengingComponent,
    SearchingComponent
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
    isChallenging() {
      return useUserStore().state === "CHALLENGING";
    },
    isViewingScoreScreen() {
      return useUserStore().state === "VIEWING_SCORE_SCREEN";
    }
  },
  methods: {
    endGame(data: GameState) {
      this.gameState = data;
      this.showScoreScreen = true;
    },
  },
  mounted() {
    useSocketStore().pong!.on("endGame", this.endGame);
    useFriendStore().stopListening();
  },
  unmounted() {
    useSocketStore().pong!.removeListener("endGame", this.endGame);
    useFriendStore().init();
  },
});
</script>
