<template>
	<div class="background">
		<div class="container-fluid d-flex justify-content-center">
			<div class="card card-style" style="border-radius: 2em;">
				<div class="card-body p-5 text-center text-white-50">
					<img src="/src/assets/pongHub.png" alt="ponghub" id="ponghubLogin" />
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
	margin: 0;
	position: absolute !important;
	top: 40%;
	-ms-transform: translateY(40%);
	transform: translateY(40%);
}

#ponghubLogin {
	width: 150px;
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
