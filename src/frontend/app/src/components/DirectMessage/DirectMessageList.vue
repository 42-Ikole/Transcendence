<template>
<h1> Direct Messages</h1>
<div v-for="dm in directMessages" :key="dm.id">
	<button @click="goToDm(dm)">
		{{ otherUser(dm) }}
	</button>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { makeApiCall } from "@/utils/ApiCall";
import type { DirectMessage } from "./DirectMessage.types";
import { useUserStore } from "@/stores/UserStore";
import { mapState } from "pinia";
import { useSocketStore } from "@/stores/SocketStore";

interface DataObject {
	directMessages: DirectMessage[];
}

export default defineComponent({
	data(): DataObject {
		return {
			directMessages: [],
		};
	},
	computed: {
		...mapState(useSocketStore, ["status", "chat"]),
		selfId() {
			return useUserStore().profileData!.id;
		},
	},
	methods: {
		async refresh() {
			const response = await makeApiCall("/chat/directMessage");
			this.directMessages = await response.json();
		},
		otherUser(dm: DirectMessage) {
			if (!dm.userOne || !dm.userTwo) {
				return;
			}
			if (dm.userOne.id !== this.selfId) {
				return dm.userOne.username;
			}
			return dm.userTwo.username;
		},
		goToDm(dm: DirectMessage) {
			this.$router.push(`/dm/${dm.id}`);
		},
	},
	async mounted() {
		await this.refresh();
		// refresh on DM  or block updates
		this.status!.on('friendUpdate', this.refresh);
		this.chat!.on('dmCreated', this.refresh);
	},
	unmounted() {
		// disable listener
		this.status!.removeListener('friendUpdate', this.refresh);
		this.chat!.removeListener('dmCreated', this.refresh);
	},
});
</script>
