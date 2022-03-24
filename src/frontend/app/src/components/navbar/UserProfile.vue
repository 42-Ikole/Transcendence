<template>
  <div class="btn-group">
    <button type="button" class="buttonImage dropdown-toggle" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
    </button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li><button class="dropdown-item" type="button">Profile</button></li>
      <li><hr class="dropdown-divider"></li>
      <li><button class="dropdown-item" type="button" @click="logout">Logout</button></li>
    </ul>
  </div>
</template>

<style>
.buttonImage{
	/* background-image: url("@/assets/transcendence turbo.png"); */
  background: #f0f0f0 url("@/assets/profileplaceholder.jpeg");
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50px;
  height: 80px;
  width: 80px;
  border-width: 0px;
  /* padding: 8px 8px 8px 32px; */
  /* background-position: 8px 8px; */
  background-repeat: no-repeat;

}

</style>

<script lang="ts">
import { defineComponent } from "vue";
import { loginUser, logoutUser, getUserInfo } from "@/utils/Login";
import { mapState } from "pinia";
import { useAuthenticationStore } from "@/stores/authentication";
import  LoggedOut  from "@/components/login/LoggedOut.vue";
import makeApiCall from "@/utils/ApiCall";

export default defineComponent({
  data() {
    return {
      userData: "",
	  // userName: await makeApiCall("/")
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
    ...mapState(useAuthenticationStore, {
      isAuthenticated: "isAuthenticated",
    }),
  },
});
</script>
