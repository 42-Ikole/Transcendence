<template>
  <p>Two Factor Authentication State</p>
  <input v-model="code" placeholder="enter code" />
  <button @click="submit">Submit</button>
  <button @click="logout">Logout</button>
</template>

<script lang="ts">
import { useAuthenticationStore } from "@/stores/authentication";
import makeApiCall from "@/utils/ApiCall";
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
      const response = await makeApiCall("/2fa/authenticate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ twoFactorCode: this.code }),
      });
      if (response.ok) {
        useAuthenticationStore().login();
      }
    },
    async logout() {
      await logoutUser(this.$router);
    },
  },
});
</script>
