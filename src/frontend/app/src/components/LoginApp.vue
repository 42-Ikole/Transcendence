<template>
  <div>
    <button @click="login">Login</button>
    <button @click="logout">Logout</button>
    <div v-if="isAuthenticated">
      <p>You are logged in.</p>
      <button @click="getUserData">Get User Data</button>
      <p>User: {{ userData }}</p>
    </div>
    <p v-else>You are logged out.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { loginUser, logoutUser, getUserInfo } from "@/utils/Login";
import { mapState } from "pinia";
import { useAuthenticationStore } from "@/stores/authentication";

export default defineComponent({
  data() {
    return {
      userData: "",
    };
  },
  methods: {
    login() {
      loginUser();
    },
    logout() {
      logoutUser(this.$router);
    },
    async getUserData() {
      this.userData = await getUserInfo();
    },
  },
  computed: {
    ...mapState(useAuthenticationStore, {
      isAuthenticated: "getAuthenticationStatus",
    }),
  },
});
</script>
