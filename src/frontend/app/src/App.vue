<template>
  <div v-if="connectionDenied">
    <ConnectionDenied />
  </div>

  <div v-if="pongMode">
    <PongView />
  </div>
  <div v-else>
    <header>
      <div v-if="isAuthenticated">
        <NavBar />
      </div>
    </header>
    <RouterView />
  </div>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import NavBar from "@/components/navbar/NavBar.vue";
import { mapState } from "pinia";
import ConnectionDenied from "./components/Authentication/ConnectionDenied.vue";
import PongView from "./views/PongView.vue";

const PONG_STATES = ["SEARCHING" ,"PLAYING", ,"OBSERVING", ,"CHALLENGED", "CHALLENGING", "VIEWING_SCORE_SCREEN"];

export default defineComponent({
  components: {
    NavBar,
    RouterView,
    ConnectionDenied,
    PongView
},
  computed: {
    ...mapState(useUserStore, ["state", "authenticatedState", "profileData"]),
    connectionDenied() {
      return this.state === "CONNECTION_DENIED";
    },
    isAuthenticated() {
      return this.authenticatedState === "AUTHENTICATED";
    },
    pongMode() {
      return PONG_STATES.includes(this.state);
    },
  },
});
</script>
