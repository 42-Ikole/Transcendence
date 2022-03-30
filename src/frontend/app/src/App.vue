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
    }),
    connectionDenied() {
      return this.state === "CONNECTION_DENIED";
    },
  },
  computed: {
    ...mapState(useUserStore, {
      state: "authenticatedState",
    }),
    isLoggedIn() {
      return !(this.state === "OAUTH");
    },
	isAuthenticated() {
		return this.state === "AUTHENTICATED";
	},
  },
});
</script>
