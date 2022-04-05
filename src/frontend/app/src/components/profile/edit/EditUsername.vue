<template>
<div class="input-group mt-3">
	<span class="input-group-text" id="inputGroupPrepend">New Username</span>
	<input type="text" @keyup.enter="updateUsername" v-model="newUsername" id="validationCustomUsername" aria-describedby="inputGroupPrepend" required>
	<button class="btn btn-secondary btn-sm" type="submit" @click="updateUsername">Update</button>
</div>
<div v-if="usernameInvalid" class="text-warning">
	invalid username
</div>
<div v-if="wasUpdated" class="text-info">
	updated!
</div>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { mapState } from "pinia";
import { defineComponent } from "vue";

export default defineComponent({
	emits: ["update"],
	data() {
		return {
			usernameInvalid: false,
			wasUpdated: false,
			newUsername: "",
		};
	},
	computed: {
		...mapState(useUserStore, ["profileData"]),
		username() {
			return this.profileData!.username;
		},
	},
	methods: {
		async updateUsername() {
			this.wasUpdated = false;
			if (!this.newUsername) {
				this.usernameInvalid = true;
				return;
			}
			// 1. API call to check if we can update it (unique username)
			// 2. update it
			this.$emit('update');
			this.resetState();
			this.wasUpdated = true;
		},
		resetState() {
			this.usernameInvalid = false;
			this.newUsername = "";
		},
	},
});
</script>
