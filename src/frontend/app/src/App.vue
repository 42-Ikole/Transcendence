<template>
  <header>
    <div v-if="isLoggedIn">
      <NavBar />
    </div>
  </header>
  <div>
    <RouterView />
  </div>
</template>

<script lang="ts">
import {
  useAuthenticationStore,
  type AuthenticatedState,
} from "@/stores/authentication";
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import NavBar from "@/components/navbar/NavBar.vue";
import { mapState } from "pinia";

export default defineComponent({
  components: {
    NavBar,
    RouterView,
  },
  computed: {
    ...mapState(useAuthenticationStore, {
      state: "authenticatedState",
    }),
    isLoggedIn() {
      return !(this.state === "OAUTH");
    },
  },
});
</script>
