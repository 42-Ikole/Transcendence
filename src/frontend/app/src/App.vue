<template>

  <div v-if="connectionDenied">
    <ConnectionDenied />
  </div>

  <div v-else>
    <header>
      <div>
        <NavBar />
      </div>
    </header>
    <div class="m-3">
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import NavBar from "@/components/NavBar.vue";
import { mapState } from "pinia";
import { useUserStore } from "./stores/UserStore";
import ConnectionDenied from "./components/Authentication/ConnectionDenied.vue";

export default defineComponent({
  components: {
    NavBar,
    RouterView,
    ConnectionDenied
},
  computed: {
    ...mapState(useUserStore, {
      state: "state"
    }),
    connectionDenied() {
      return this.state === "CONNECTION_DENIED";
    }
  },
});
</script>
