<template>
  <div>
    <p>
      <button @click="accept">Accept</button>
      <button @click="reject">Reject</button>
    </p>
  </div>
</template>

<script lang="ts">
import { useSocketStore } from "@/stores/SocketStore";
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    accept() {
      useSocketStore().pong!.emit("acceptChallenge");
    },
    reject() {
      useSocketStore().pong!.emit("rejectChallenge");
    },
  },
});
</script>
