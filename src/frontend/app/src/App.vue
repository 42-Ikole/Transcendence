<template>
  <div v-if="connectionDenied">
    <ConnectionDenied />
  </div>

  <div v-else>
    <header>
      <div v-if="isAuthenticated">
        <NavBar />
      </div>
    </header>
    <div>
    <h3>You are: {{ username }}</h3>
    <div class="m-3">
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts">
import {
  useUserStore,
  type AuthenticatedState,
} from "@/stores/UserStore";
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import NavBar from "@/components/navbar/NavBar.vue";
import { mapState } from "pinia";
import { useUserStore } from "./stores/UserStore";
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
    username() {
      if (this.profileData) {
        return this.profileData.username;
      }
      return "not logged in";
    },
  },
});
</script>
