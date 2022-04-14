<template>
  <div class="container-fluid pong-margin">
    <div>
      <div class="row">
        <div class="col-lg-3">
          <h3>Ranked:</h3>
          <FindMatch />
        </div>
        <div class="col-lg-3">
          <h3>Spectate:</h3>
          <ActiveGames />
        </div>
        <div class="col-lg-3">
          <h3>Challenge:</h3>
          <ChallengeUsers />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChallengeUsers from "../components/Pong/ChallengeUsers.vue";
import ActiveGames from "../components/Pong/ActiveGames.vue";
import FindMatch from "../components/Pong/FindMatch.vue";

export default defineComponent({
  components: {
    ChallengeUsers,
    ActiveGames,
    FindMatch,
  },
});
</script>

<style>
.pong-margin {
  padding-left: 10% !important;
  padding-right: 10% !important;
  overflow: hidden;
}
</style>
