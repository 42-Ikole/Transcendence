<template>
  <div class="text-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div class="text-center mt-3">
    <p>Waiting for challenge reply...</p>
    <button class="btn btn-outline-light btn-sm" @click="cancelChallenge">
      Cancel
    </button>
  </div>
</template>

<script lang="ts">
import { useSocketStore } from "@/stores/SocketStore";
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    cancelChallenge() {
      useSocketStore().pong!.emit("cancelChallenge");
    },
  },
});
</script>
