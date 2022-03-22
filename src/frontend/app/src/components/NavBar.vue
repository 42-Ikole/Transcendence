<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li v-for="route in routes" v-bind:key="route.path" class="nav-item">
            <RouterLink class="nav-link" :to="route.path">
              {{ route.message }}</RouterLink
            >
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

interface Route {
  path: string;
  message: string;
}

interface DataObject {
  routes: Route[];
}

export default defineComponent({
  data(): DataObject {
    return {
      routes: [
        { path: "/", message: "Home" },
        { path: "/about", message: "About" },
        { path: "/2fa", message: "Two Factor" },
        { path: "/login", message: "Login" },
        { path: "/chatrooms", message: "Chatrooms"}
      ],
    };
  },
  components: {
    RouterLink,
  },
});
</script>
