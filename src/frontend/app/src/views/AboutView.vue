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

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
