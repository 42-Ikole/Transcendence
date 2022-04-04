<template>
  <div class="input-group">
    <input
      v-bind:class="setErrorStyling"
      v-model="code"
      type="text"
      class="form-control"
      placeholder="2FA code"
      aria-label="2FA code"
    />
    <button
      v-bind:class="setErrorStyling"
      class="btn btn-outline-light"
      @click="submit"
    >
      Submit
    </button>
    <button
      v-bind:class="setErrorStyling"
      class="btn btn-outline-light"
      @click="logout"
    >
      Logout
    </button>
  </div>
</template>

<style>
.errorStyling {
  border-color: red !important;
}
</style>

<script lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { makeApiCallJson } from "@/utils/ApiCall";
import { logoutUser } from "@/utils/Login";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      code: "",
      error: false,
    };
  },
  computed: {
    setErrorStyling() {
      if (this.error) {
        return "errorStyling";
      }
      return "";
    },
  },
  methods: {
    async submit() {
      const response = await makeApiCallJson("/2fa/authenticate", "POST", {
        twoFactorCode: this.code,
      });
      if (response.ok) {
        this.error = false;
        useUserStore().login();
      } else {
        this.code = "";
        this.error = true;
      }
    },
    async logout() {
      await logoutUser(this.$router);
    },
  },
});
</script>
