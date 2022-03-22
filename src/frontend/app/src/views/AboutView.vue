<template>
  <button @click="logout">logout</button>
</template>

<script lang="ts">
import { logoutUser } from "@/utils/Login";
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    logout() {
      logoutUser(this.$router);
    },
  },
});
</script>
