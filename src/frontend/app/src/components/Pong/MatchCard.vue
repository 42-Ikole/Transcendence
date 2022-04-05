<template>
  <div class="card text-white" :class="matchWonClass">
    <div class="card-body">
      <div class="row">
        <div class="col-sm-4">
          <MiniProfile />
          <h3 class="text-white text-center"> {{ userScore }} </h3>
        </div>
        <div class="col-sm-auto">
          <h2 class="text-white texter-center">VS</h2>
        </div>
        <div class="col-sm-4 ms-auto">
          <MiniProfile />
          <h3 class="text-white text-center"> {{ opponentScore }} </h3>
        </div>
      </div>
      <p class="card-text col-sm text-center">{{ match.createdDate }}</p>
    </div>
  </div>
</template>

<style>
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
import { Match } from "@/types/MatchType";
import { useUserStore } from "@/stores/UserStore";

export default defineComponent({
  components: {
    MiniProfile,
  },
  props: {
    match: {
      type: Object as PropType<Match>,
      required: true,
    },
  },
  computed: {
    isWinner() {
      return this.match.winner.id === useUserStore().profileData.id;
    },
    userScore() {
      return this.isWinner ? this.match.winnerScore : this.match.loserScore;
    },
    opponentScore() {
      return this.isWinner ? this.match.loserScore : this.match.winnerScore;
    },
    matchWonClass() {
      return this.isWinner ? "match-won" : "match-lost";
    },
  }
});
</script>
