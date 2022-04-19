<template>
  <div v-for="game in games" :key="game.name">
    <ActiveGame :game="game" />
  </div>
</template>

<script lang="ts">
import { useSocketStore } from "@/stores/SocketStore";
import makeApiCall from "@/utils/ApiCall";
import { mapState } from "pinia";
import { defineComponent } from "vue";
import type { LiveGameData } from "./PongTypes";
import ActiveGame from "./ActiveGame.vue";

interface DataObject {
  games: LiveGameData[];
}

export default defineComponent({
  data(): DataObject {
    return {
      games: [],
    };
  },
  computed: {
    ...mapState(useSocketStore, ["pong"]),
  },
  methods: {
    async refresh() {
      const response = await makeApiCall("/pong/games");
      if (response.ok) {
        this.games = await response.json();
      }
    },
  },
  async mounted() {
    await this.refresh();
    this.pong!.emit("subscribeGameUpdate");
    this.pong!.on("gameUpdate", this.refresh);
  },
  unmounted() {
    this.pong!.emit("unsubscribeGameUpdate");
    this.pong!.removeListener("gameUpdate", this.refresh);
  },
  components: { ActiveGame },
});
</script>
