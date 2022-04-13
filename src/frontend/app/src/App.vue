<template>
  <div v-if="connectionDenied">
    <ConnectionDenied />
  </div>
  <div v-else-if="isChallenging">Challenging user...</div>
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

export default defineComponent({
  components: {
    NavBar,
    RouterView,
    ConnectionDenied,
  },
  computed: {
    ...mapState(useUserStore, {
      state: "state",
      authenticatedState: "authenticatedState",
      profileData: "profileData",
    }),
    connectionDenied() {
      return this.state === "CONNECTION_DENIED";
    },
    isAuthenticated() {
      return this.authenticatedState === "AUTHENTICATED";
    },
    isChallenging() {
      return this.state === "CHALLENGING";
    },
  },
});
</script>
