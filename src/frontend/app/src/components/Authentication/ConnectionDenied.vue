<template>
  <h1>Connection Denied</h1>
  <p>
    You are logged in on a different tab, please disconnect out there and try
    again
  </p>
  <button @click="retry">Retry</button>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    retry() {
      useUserStore().login();
    },
  },
});
</script>
