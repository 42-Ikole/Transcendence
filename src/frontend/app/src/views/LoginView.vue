<template>
  <div class="background">
    <div class="container-fluid d-flex justify-content-center">
      <div class="card card-style" style="border-radius: 2em">
        <div class="card-body p-5 text-center">
          <img src="/src/assets/pongHub.png" alt="ponghub" id="ponghubLogin" />
          <p class="text-white mb-5">
            The best pong experience you will ever have💦
          </p>

          <div v-if="isOAuth">
            <LoggedOut />
          </div>
          <div v-else-if="isTwoFactor">
            <TwoFactorApp />
          </div>
          <div v-else-if="setupRequired">
            <SetupProfile />
          </div>
          <div v-else>
            <LoggedIn />
          </div>
        </div>
        <p class="footnote text-white-50">By the New Coders on the Block</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { mapState } from "pinia";
import { defineComponent } from "vue";
import LoggedIn from "@/components/Authentication/LoggedIn.vue";
import TwoFactorApp from "@/components/Authentication/TwoFactorApp.vue";
import LoggedOut from "@/components/Authentication/LoggedOut.vue";
import SetupProfile from "../components/profile/SetupProfile.vue";

export default defineComponent({
  components: {
    LoggedIn,
    LoggedOut,
    TwoFactorApp,
    SetupProfile,
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
    setupRequired() {
      return this.state === "ACCOUNT_SETUP";
    },
  },
});
</script>

<style>
.background {
  background-image: url("@/assets/transcendence turbo.png");
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  background-position: left top;
}

.card-style {
  background-color: rgba(63, 63, 63, 0.9) !important;
  margin: 0;
  position: absolute !important;
  top: 40%;
  -ms-transform: translateY(40%);
  transform: translateY(40%);
}

#ponghubLogin {
  width: 150px;
}

.footnote {
  text-align: center;
}
</style>
