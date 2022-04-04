<template>
  <div class="row mb-3">
    <button class="btn btn-outline-light btn-lg px-5" @click="login('intra')">
      Login with Intra
    </button>
  </div>
  <button
    class="btn btn-outline-light btn-lg px-5 me-2"
    @click="login('github')"
  >
    Login with Github
  </button>
  <button
    class="btn btn-outline-light btn-lg px-5 ms-2"
    @click="login('discord')"
  >
    Login with Discord
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { OAuthProvider, loginUser } from "@/utils/Login";

export default defineComponent({
  methods: {
    login(type: OAuthProvider) {
      loginUser(type);
    },
  },
});
</script>
