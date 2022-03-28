<template>

  <div class="input-group">
    <input v-model="code" type="text" class="form-control" placeholder="2FA code" aria-label="2FA code">
    <button class="btn btn-outline-light" @click="submit">Submit</button>
    <button class="btn btn-outline-light" @click="logout">Logout</button>
  </div>
</template>

<script lang="ts">
import { useAuthenticationStore } from "@/stores/authentication";
import { useUserStore } from "@/stores/UserStore";
import { makeApiCallJson } from "@/utils/ApiCall";
import { logoutUser } from "@/utils/Login";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      code: "",
    };
  },
  methods: {
    async submit() {
      const response = await makeApiCallJson("/2fa/authenticate", "POST", {
        twoFactorCode: this.code,
      });
      if (response.ok) {
        useUserStore().login();
      }
    },
    async logout() {
      await logoutUser(this.$router);
    },
  },
});
</script>
