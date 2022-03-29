<template>
  <div>
    <div v-if="isAuthenticated">
      <button @click="getAuthenticationState">Get Authentication State</button>
      <p>User: {{ userData }}</p>
      <button @click="logout">Logout</button>
      <p>You are logged in.</p>
    </div>
    <div v-else>
      <button @click="login('intra')">Login with Intra</button>
      <button @click="login('github')">Login with Github</button>
      <button @click="login('discord')">Login with Discord</button>
      <p>You are logged out.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  loginUser,
  logoutUser,
  getUserInfo,
  OAuthProvider,
} from "@/utils/Login";
import { mapState } from "pinia";
import { useUserStore } from "@/stores/UserStore";

interface DataObject {
  userData: any;
}

export default defineComponent({
  data(): DataObject {
    return {
      userData: "",
    };
  },
  methods: {
    login(type: OAuthProvider) {
      loginUser(type);
    },
    logout() {
      logoutUser(this.$router);
    },
    async getAuthenticationState() {
      this.userData = await getUserInfo();
    },
  },
  computed: {
    ...mapState(useUserStore, {
      isAuthenticated: "isAuthenticated",
    }),
  },
});
</script>
