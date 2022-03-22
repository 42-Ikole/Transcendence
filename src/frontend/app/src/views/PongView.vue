<template>
  <div v-if="isPlaying">
    <PongGame />
  </div>
  <div v-else-if="isSearching">
    Searching...
  </div>
  <div v-else>
    <FindMatch />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PongGame from "@/components/Pong/PongGame.vue";
import FindMatch from "@/components/Pong/FindMatch.vue";
import { mapState } from "pinia";
import { useUserStore } from "@/stores/UserStore";

export default defineComponent({
  components: {
    PongGame,
    FindMatch,
  },
  computed: {
    isPlaying() {
      const userStore = useUserStore();
      return userStore.state === "PLAYING";
    },
    isSearching() {
      return useUserStore().state === "SEARCHING";
    }
  },
});
</script>
