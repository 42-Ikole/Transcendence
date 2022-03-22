<template>
  <div v-if="isOAuth">
    <LoginApp />
  </div>
  <div v-else-if="isTwoFactor">
    <TwoFactorApp />
  </div>
  <div v-else>
    <LoginApp />
  </div>
</template>

<script lang="ts">
import { mapState } from "pinia";
import { defineComponent } from "vue";
import LoginApp from "@/components/Authentication/LoginApp.vue";
import TwoFactorApp from "@/components/Authentication/TwoFactorApp.vue";
import { useUserStore, type AuthenticatedState } from "@/stores/UserStore";

export default defineComponent({
  components: {
    LoginApp,
    TwoFactorApp,
  },
  computed: {
    ...mapState(useUserStore, {
      state: "authenticatedState",
    }),
    isTwoFactor() {
      return this.state === "2FA";
    },
    isOAuth() {
      return this.state === "OAUTH";
    },
  },
});
</script>
