<template>
  <h2>Username</h2>
  <div class="input-group mt-3">
    <div class="input-group mb-3">
      <input
        type="text"
        class="input-group-text form-control-lg"
        @keyup.enter="updateUsername"
        v-model="newUsername"
        maxlength="30"
        :placeholder="username"
      />
      <button
        class="btn btn-success"
        type="button"
        id="button-addon2"
        @click="updateUsername"
      >
        Save
      </button>
    </div>
  </div>
  <div v-if="usernameInvalid" class="text-warning">invalid username</div>
  <div v-if="wasUpdated" class="text-info">updated!</div>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { mapState } from "pinia";
import { defineComponent } from "vue";
import { makeApiCallJson } from "@/utils/ApiCall";

export default defineComponent({
  emits: ["update"],
  data() {
    return {
      usernameInvalid: false,
      wasUpdated: false,
      newUsername: "",
    };
  },
  computed: {
    ...mapState(useUserStore, ["profileData"]),
    username() {
      if (!this.profileData) {
        return "";
      }
      return this.profileData.username;
    },
  },
  methods: {
    async updateUsername() {
      this.wasUpdated = false;
      if (!this.newUsername) {
        this.usernameInvalid = true;
        return;
      }
      const response = await makeApiCallJson("/user/update", "PATCH", {
        username: this.newUsername,
      });
      if (!response.ok) {
        this.usernameInvalid = true;
        return;
      }
      this.$emit("update");
      this.resetState();
      this.wasUpdated = true;
    },
    resetState() {
      this.usernameInvalid = false;
      this.newUsername = "";
    },
  },
});
</script>
