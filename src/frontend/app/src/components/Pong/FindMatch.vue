<template>
  <button @click="requestMatch">Find Match</button>
</template>

<script lang="ts">
import { useSocketStore } from "@/stores/SocketStore";
import { useUserStore } from "@/stores/UserStore";
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    requestMatch() {
      useUserStore().setState("SEARCHING");
      useSocketStore().pong?.emit("requestMatch", { type: "matchmaking", targetId: null });
    },
  },
});
</script>
