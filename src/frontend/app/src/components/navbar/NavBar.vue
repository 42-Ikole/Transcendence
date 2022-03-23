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
			<a class="navbar-brand mx-auto" href="#">PongHub</a>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
				<span class="navbar-toggler-icon"></span>
			</button>
		</div>
		<div class="navbar-collapse collapse w-100 order-3 dual-collapse2 me-5">
			
		</div>
	</nav>
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
      ],
    };
  },
  components: {
	RouterLink,
  },
});
</script>
