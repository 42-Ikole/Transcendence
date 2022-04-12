<template>
  <div class="card text-white" :class="matchWonClass">
    <div class="card-body">
      <div class="row">
        <div class="col-sm-4">
          <MiniProfile :user="winner" />
          <h3 class="text-white text-start"> {{ this.match.winnerScore }} </h3>
        </div>
        <div class="col-sm-auto">
          <h2 class="text-white texter-center">VS</h2>
        </div>
        <div class="col-sm-4 ms-auto">
          <MiniProfile :user="loser" />
          <h3 class="text-white text-end"> {{ this.match.loserScore }} </h3>
        </div>
      </div>
      <p class="card-text col-sm text-center">{{ this.matchDate }}</p>
    </div>
  </div>
</template>

<style>

.card {
	margin-bottom: 2rem;
}

.match-won {
  background-color: #088c12 !important;
}

.match-lost {
  background-color: #c51010 !important;
}

.texter-center {
  top: 25%;
}
</style>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import MiniProfile from "@/components/profile/MiniProfile.vue";
import type { Match } from "@/types/MatchType";
import { useUserStore } from "@/stores/UserStore";

interface blubData {
	matchDate: string;
}
export default defineComponent({


data() : blubData {
    return {
      matchDate: (new Date(Date.parse(this.match.createdDate))).toDateString(),
    };
  },
  components: {
    MiniProfile,
  },
  props: {
    match: {
      type: Object as PropType<Match>,
      required: true,
    },
	userId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    isWinner() {
      return this.match.winner.id === this.userId;
    },
    matchWonClass() {
      return this.isWinner ? "match-won" : "match-lost";
    },
    winner() {
      return this.match.winner;
    },
    loser() {
      return this.match.loser;
    },
  }
});
</script>
