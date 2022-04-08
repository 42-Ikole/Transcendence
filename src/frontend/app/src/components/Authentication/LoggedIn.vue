<template>
  <div>
    <div v-if="isAuthenticated">
      <button @click="logout">Logout</button>
      <p>You are logged in.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { logoutUser } from "@/utils/Login";
import { mapState } from "pinia";
import { useUserStore } from "@/stores/UserStore";

export default defineComponent({
  methods: {
    logout() {
      logoutUser(this.$router);
    },
  },
  computed: {
    ...mapState(useUserStore, {
      isAuthenticated: "isAuthenticated",
    }),
  },
});
</script>
