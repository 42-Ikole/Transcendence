<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink class="navbar-toggler navbar-nav navbar-text" to="/">Home</RouterLink>
        <RouterLink class="navbar-toggler navbar-nav navbar-text" to="/about">About</RouterLink>
        <RouterLink class="navbar-toggler navbar-nav navbar-text" to="/2fa">Two Factor</RouterLink>
      </nav>
    </div>
  </header>

  <br>
  <RouterView />
</template>
