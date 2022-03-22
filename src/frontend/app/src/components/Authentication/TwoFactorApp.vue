<template>
  <p>Two Factor Authentication State</p>
  <input v-model="code" placeholder="enter code" />
  <button @click="submit">Submit</button>
  <button @click="logout">Logout</button>
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
