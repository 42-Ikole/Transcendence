<template>
  <div>
    <div v-if="isAuthenticated">
      <button @click="getAuthenticationState">Get Authentication State</button>
      <p>User: {{ userData }}</p>
      <button @click="logout">Logout</button>
      <p>You are logged in.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { loginUser, logoutUser, getUserInfo } from "@/utils/Login";
import { mapState } from "pinia";
import  LoggedOut  from "@/components/login/LoggedOut.vue";
import { useUserStore } from "@/stores/UserStore";

export default defineComponent({
  data() {
    return {
      userData: "" as any,
    };
  },
  components: {
	  LoggedOut,
  },
  methods: {
    login() {
      loginUser();
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
