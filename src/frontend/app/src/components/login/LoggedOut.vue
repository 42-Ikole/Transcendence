<template>
	<button class="btn btn-outline-light btn-lg px-5" @click="login" >Login</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { loginUser } from "@/utils/Login";

export default defineComponent({
  methods: {
    login() {
      loginUser();
    },
  },
});
</script>
