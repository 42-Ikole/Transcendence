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
import {
  useAuthenticationStore,
  type AuthenticatedState,
} from "@/stores/authentication";
import { mapState } from "pinia";
import { defineComponent } from "vue";
import LoginApp from "@/components/LoginApp.vue";
import TwoFactorApp from "@/components/TwoFactorApp.vue";

export default defineComponent({
  components: {
    LoginApp,
    TwoFactorApp,
  },
  computed: {
    ...mapState(useAuthenticationStore, {
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

<style></style>
