<template>
  <p>
    <button @click="refresh">Refresh Games</button>
  </p>
  <div v-for="game in games" :key="game.name">
    <p>
      {{ getMessage(game) }}
      <button @click="observe(game)">Observe</button>
    </p>
  </div>
</template>

<script lang="ts">
import { useSocketStore } from "@/stores/SocketStore";
import makeApiCall from "@/utils/ApiCall";
import { defineComponent } from "vue";
import type { GameState } from "./PongTypes";

interface ActiveGame {
  state: GameState;
  name: string;
}

interface DataObject {
  games: ActiveGame[];
}

export default defineComponent({
  data(): DataObject {
    return {
      games: [],
    };
  },
  methods: {
    getMessage(game: ActiveGame) {
      const p1 = game.state.playerOne;
      const p2 = game.state.playerTwo;
      return `${p1.username} (${p1.score}) vs (${p2.score}) ${p2.username}`;
    },
    async refresh() {
      const response = await makeApiCall("/pong/games");
      if (response.ok) {
        this.games = await response.json();
      }
    },
    async observe(game: ActiveGame) {
      const response = await makeApiCall(`/pong/status/${game.name}`);
      if (response.ok && (await response.text()) === "OK") {
        useSocketStore().pong!.emit("requestObserve", { roomName: game.name } );
      } else {
        await this.refresh();
        // TODO: popup/message: game is already finished
      }
    },
  },
  async mounted() {
    await this.refresh();
  },
});
</script>
