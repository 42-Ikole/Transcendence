<template>
  <button
    class="btn btn-outline-light btn-lg px-5 me-2"
    @click="requestMatch(false)"
  >
    Find Match
  </button>
  <button
    class="btn btn-outline-light btn-lg px-5 me-2"
    @click="requestMatch(true)"
  >
    Find Match [Default Mode]
  </button>
</template>

<script lang="ts">
import { useSocketStore } from "@/stores/SocketStore";
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    requestMatch(mode: boolean) {
      useSocketStore().pong?.emit("requestMatch", {
        type: "matchmaking",
        targetId: null,
        default: mode,
      });
    },
  },
});
</script>
