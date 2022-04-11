<template>
  <div class="btn-group">
    <button
      type="button"
      class="buttonImage"
      data-bs-toggle="dropdown"
      data-bs-display="static"
      aria-expanded="false"
      :style="avatar"
    ></button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li>
        <button class="dropdown-item" type="button" @click="goToProfile">
          Profile
        </button>
      </li>
      <li>
        <button class="dropdown-item" type="button" @click="editProfile">
          Edit
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
import { mapState } from "pinia";
import { useUserStore } from "@/stores/UserStore";
import LoggedOut from "@/components/Authentication/LoggedOut.vue";
import makeApiCall from "@/utils/ApiCall";

export default defineComponent({
  data() {
    return {
      url: "",
    };
  },
  methods: {
    logout() {
      logoutUser(this.$router);
    },
    goToProfile() {
      this.$router.push("/profile");
    },
    editProfile() {
      this.$router.push("/profile/edit");
    },
  },
  computed: {
    ...mapState(useUserStore, ["avatarUpdated"]),
    avatar() {
      const url = useUserStore().avatarUrl;
      return `background-image: url(${url})`;
    },
  },
});
</script>
