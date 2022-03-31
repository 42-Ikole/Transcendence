<template>
  <button class="btn btn-outline-light btn-lg px-5 me-2" @click="requestMatch">Find Match</button>
</template>

<script lang="ts">
import { useSocketStore } from "@/stores/SocketStore";
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    requestMatch() {
      useSocketStore().pong?.emit("requestMatch", {
        type: "matchmaking",
        targetId: null,
      });
    },
  },
});
</script>
