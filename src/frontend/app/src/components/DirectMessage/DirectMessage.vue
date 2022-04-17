<template>
<div v-if="isDefined">

</div>
<div v-else>
	<p> Loading Chat... </p>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import makeApiCall from "@/utils/ApiCall";
import type { PublicUser } from "@/types/UserType";

interface DataObject {
	userOne: PublicUser | undefined;
	userTwo: PublicUser | undefined;
	messages: any[];
}

export default defineComponent({
	props: {
		directMessageId: {
			type: Number,
			required: true,
		}
	},
	data(): DataObject {
		return {
			userOne: undefined,
			userTwo: undefined,
			messages: [],
		};
	},
	computed: {
		isDefined() {
			return this.userOne !== undefined && this.userTwo !== undefined;
		},
	},
	async mounted() {
		const response = await makeApiCall(`/chat/directMessage/${this.directMessageId}`);
		if (!response.ok) {
			console.error("failed to retrieve messages");
			return;
		}
		const dm = await response.json();
		this.messages = dm.messages;
		this.userOne = dm.userOne;
		this.userTwo = dm.userTwo;
		// subscribe
	},
	unmounted() {
		// unsubscribe
	},
})
</script>
