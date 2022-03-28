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
  useUserStore,
  type AuthenticatedState,
} from "@/stores/UserStore";
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
    ...mapState(useUserStore, {
      state: "authenticatedState",
    }),
    isLoggedIn() {
      return !(this.state === "OAUTH");
    },
  },
});
</script>
