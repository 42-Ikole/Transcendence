<template>
  <button @click="requestMatch(false)">Find Match</button>
  <button @click="requestDefaultMatch(true)">Find Default Match</button>
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
