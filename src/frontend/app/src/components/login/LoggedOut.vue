<template>
	<div class="background">
		<div class="container-fluid d-flex justify-content-center">
			<div class="card card-style" style="border-radius: 2em;">
				<div class="card-body p-5 text-center text-white-50">
					<h2 class="fw-bold mb-2 logo">PongHub</h2>
					<p class="text-white-50 mb-5">Login to our juicy website by authenticating with intra💦</p>

					<button class="btn btn-outline-light btn-lg px-5" @click="login" >Login</button>
				</div>
			</div>
		</div>
	</div>
</template>

<!-- style -->
<style>
.background{
	background-image: url("@/assets/transcendence turbo.png");
	background-repeat: no-repeat;
	background-size: cover;
	height: 100vh;
	background-position: left top;
}

.card-style {
	background-color: rgba(63, 63, 63, 0.9) !important;
	/* background-image: linear-gradient(to bottom right, rgba(255, 10, 243, .8), rgba(10, 226, 255, .8)); */
	margin: 0;
	position: absolute !important;
	top: 30%;
	-ms-transform: translateY(-30%);
	transform: translateY(-30%);
}

.logo {
	color: #e66000;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { loginUser } from "@/utils/Login";
import { mapState } from "pinia";
import { useAuthenticationStore } from "@/stores/authentication";

export default defineComponent({
  methods: {
    login() {
      loginUser();
    },
  },
  computed: {
    ...mapState(useAuthenticationStore, {
      isAuthenticated: "isAuthenticated",
    }),
  },
});
</script>
