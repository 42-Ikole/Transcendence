<template>
<div class="mb-3">
	<EditUsername @update="refreshUserData" />
</div>
<EditTwoFactor @update="refreshUserData" />
</template>

<script lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { defineComponent } from "vue";
import EditTwoFactor from "@/components/profile/edit/EditTwoFactor.vue"
import EditUsername from "@/components/profile/edit/EditUsername.vue"

export default defineComponent({
	components: {
		EditTwoFactor,
		EditUsername,
	},
	methods: {
		refreshUserData() {
			console.log("updating...");
			useUserStore().refreshUserData();
		},
	}
});
</script>
