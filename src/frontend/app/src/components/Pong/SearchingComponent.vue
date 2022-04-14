<template>
  <div class="text-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div class="text-center mt-3">
    <p>Searching...</p>
    <button class="btn btn-outline-light" @click="cancelSearch">Cancel</button>
  </div>
</template>

<script lang="ts">
import { useSocketStore } from "@/stores/SocketStore";
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    cancelSearch() {
      useSocketStore().pong!.emit("cancelMatchmaking");
    },
  },
});
</script>
