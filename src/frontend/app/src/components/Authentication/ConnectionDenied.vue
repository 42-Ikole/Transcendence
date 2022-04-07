<template>
  <h1>Connection Denied</h1>
  <p>
    You are logged in on a different tab, please disconnect out there and try
    again
  </p>
  <button @click="retry">Retry</button>
  <button @click="resetConnection">Disconnect Other Tab</button>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/UserStore";
import makeApiCall from "@/utils/ApiCall";
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    retry() {
      useUserStore().login();
    },
    async resetConnection() {
      const response = await makeApiCall("/status/reset-connection", {
        method: "DELETE",
      });
      this.retry();
    },
  },
});
</script>
