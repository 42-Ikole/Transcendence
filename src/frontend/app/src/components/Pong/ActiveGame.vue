<template>
  <p class="text-white">
    {{ gameMessage }}
    <button
      class="btn btn-outline-light btn-sm px-5 me-2 mt-1"
      @click="observe"
    >
      Observe
    </button>
  </p>
</template>

<script lang="ts">
import { useSocketStore } from "@/stores/SocketStore";
import type { PublicUser } from "@/types/UserType";
import makeApiCall from "@/utils/ApiCall";
import { mapState } from "pinia";
import { defineComponent, type PropType } from "vue";
import type { LiveGameData } from "./PongTypes";

interface DataObject {
  playerOne: PublicUser | undefined;
  playerTwo: PublicUser | undefined;
}

export default defineComponent({
  props: {
    game: {
      type: Object as PropType<LiveGameData>,
      required: true,
    },
  },
  data(): DataObject {
    return {
      playerOne: undefined,
      playerTwo: undefined,
    };
  },
  computed: {
    ...mapState(useSocketStore, ["pong"]),
    gameMessage() {
      return `${this.playerOneName} (${this.game.state.playerOne.score}) vs (${this.game.state.playerTwo.score}) ${this.playerTwoName}`;
    },
    playerOneName() {
      return this.playerName(this.playerOne);
    },
    playerTwoName() {
      return this.playerName(this.playerTwo);
    },
  },
  methods: {
    async observe() {
      this.pong!.emit("requestObserve", { roomName: this.game.name });
    },
    playerName(player: PublicUser | undefined) {
      return player !== undefined ? player.username : "unknown";
    },
    async loadPlayer(id: number): Promise<PublicUser> {
      const response = await makeApiCall(`/user/${id}`);
      return await response.json();
    },
  },
  async mounted() {
    this.playerOne = await this.loadPlayer(this.game.state.playerOne.id);
    this.playerTwo = await this.loadPlayer(this.game.state.playerTwo.id);
  },
});
</script>
