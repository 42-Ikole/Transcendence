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
import { useUserStore } from "@/stores/UserStore";
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    accept() {
      useUserStore().setState("ONLINE");
      useSocketStore().pong!.emit("acceptChallenge");
    },
    reject() {
      useUserStore().setState("ONLINE");
      useSocketStore().pong!.emit("rejectChallenge");
    },
  },
});
</script>
