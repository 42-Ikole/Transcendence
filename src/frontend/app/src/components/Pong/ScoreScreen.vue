<template>
  <div>
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
import type { PublicUser } from "@/types/UserType";
import makeApiCall from "@/utils/ApiCall";
import { defineComponent, type PropType } from "vue";
import type { GameState } from "./PongTypes";
import ChatUserDropdown from "../ChatDropdown/ChatUserDropdown.vue";

interface DataObject {
  playerOne: PublicUser | undefined;
  playerTwo: PublicUser | undefined;
}

export default defineComponent({
    props: {
        gameState: {
            type: Object as PropType<GameState | undefined>,
            required: false,
        },
    },
    computed: {
        playerOneName() {
            if (!this.playerOne) {
                return "unknown";
            }
            return this.playerOne.username;
        },
        playerTwoName() {
            if (!this.playerTwo) {
                return "unknown";
            }
            return this.playerTwo.username;
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
        isDefined() {
            return this.playerOne !== undefined && this.playerTwo !== undefined;
        },
    },
    data(): DataObject {
        return {
            playerOne: undefined,
            playerTwo: undefined,
        };
    },
    methods: {
        exitScoreScreen() {
            useSocketStore().pong!.emit("exitScoreScreen");
        },
        async loadPlayer(id: number) {
            const response = await makeApiCall(`/user/${id}`);
            return await response.json();
        },
        async refresh() {
            if (this.gameState) {
                this.playerOne = await this.loadPlayer(this.gameState.playerOne.id);
                this.playerTwo = await this.loadPlayer(this.gameState.playerTwo.id);
            }
        }
    },
    watch: {
        gameState() {
            this.refresh();
        }
    },
    mounted() {
        this.refresh();
    },
    components: { ChatUserDropdown }
});
</script>
