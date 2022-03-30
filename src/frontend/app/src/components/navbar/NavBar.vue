<template>
	<nav class="navbar navbar-expand-md navbar-dark bg-dark">
		<div class="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
			<ul class="navbar-nav mr-auto ms-5">
				<li v-for="route in routes" v-bind:key="route.path" class="nav-item">
					<RouterLink class="nav-link" :to="route.path">
					{{ route.message }}</RouterLink
					>
				</li>
			</ul>
		</div>
		<div class="mx-auto order-0">
			<div class="navbar-brand mx-auto"><img src="/src/assets/pongHub.png" alt="ponghub" id="navbarLogo" /></div>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
				<span class="navbar-toggler-icon"></span>
			</button>
		</div>
		<div class="navbar-collapse collapse w-100 order-3 dual-collapse2 me-5">
			<div class="ms-auto">
				<UserProfile/>
			</div>
		</div>
	</nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";
import UserProfile from "@/components/navbar/UserProfile.vue";

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
		{ path: "/pong", message: "Pong" },
      ],
    };
  },
  components: {
	UserProfile,
	RouterLink,
  },
});
</script>
