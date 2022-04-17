<template>
<div v-if="validId">
	<DirectMessage :direct-message-id="id"/>
</div>
<div v-else-if="error">
	<p class="text-warning">
		Error: Invalid Direct Message ID
	</p>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DirectMessage from "@/components/DirectMessage/DirectMessage.vue";
import { makeApiCall } from "@/utils/ApiCall";

export default defineComponent({
	data() {
		return {
			validId: false,
			error: false,
			id: 0,
		};
	},
	async mounted() {
		this.id = parseInt(this.$route.params.id as string);
		const response = await makeApiCall(`/chat/directMessage/authorize/${this.id}`);
		if (!response.ok) {
			this.error = true;
			return;
		}
		this.validId = true;
	},
	components: {
		DirectMessage,
	}
});
</script>
