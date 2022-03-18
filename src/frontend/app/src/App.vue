<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "@/components/HelloWorld.vue";
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/2fa">Two Factor</RouterLink>
        <RouterLink to="/websocket">Websocket</RouterLink>
        <RouterLink to="/pong">Pong</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
