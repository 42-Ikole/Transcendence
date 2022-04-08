<template>
  <div class="btn-group">
    <button
      type="button"
      class="buttonImage dropdown-toggle"
      data-bs-toggle="dropdown"
      data-bs-display="static"
      aria-expanded="false"
    ></button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li>
        <button class="dropdown-item" type="button" @click="goToProfile">
          Profile
        </button>
      </li>
      <li>
        <hr class="dropdown-divider" />
      </li>
      <li>
        <button class="dropdown-item" type="button" @click="logout">
          Logout
        </button>
      </li>
    </ul>
  </div>
</template>

<style>
.buttonImage {
  background: #f0f0f0 url("@/assets/profileplaceholder.jpeg");
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50px;
  height: 80px;
  width: 80px;
  border-width: 0px;
  background-repeat: no-repeat;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { logoutUser } from "@/utils/Login";

export default defineComponent({
  methods: {
    logout() {
      logoutUser(this.$router);
    },
    goToProfile() {
      this.$router.push("/profile");
    },
  },
});
</script>
