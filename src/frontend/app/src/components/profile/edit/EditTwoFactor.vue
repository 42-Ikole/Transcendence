<template>
<div>
	<h3>Two Factor Authentication</h3>
	<div v-if="twoFactorEnabled">
		<button class="btn btn-outline-light btn-sm" @click="disableTwoFactor">Disable</button>
	</div>
	<div v-else>
		<button class="btn btn-outline-light btn-sm ms-1" @click="enableTwoFactor">Enable</button>
	</div>
</div>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { defineComponent } from "vue";

export default defineComponent({
	emits: ["update"],
	computed: {
		twoFactorEnabled() {
			return useUserStore().profileData!.twoFactorEnabled;
		},
	},
	methods: {
		disableTwoFactor() {
			this.$emit('update');
		},
		enableTwoFactor() {
			this.$emit('update');
		},
	},
});
</script>