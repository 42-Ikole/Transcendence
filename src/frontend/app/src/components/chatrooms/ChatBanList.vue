<template>
	<h5 class="dropdown-header">Banned users:</h5>
		<ul class="btn" v-for="user in bannedUsers" :key="user.id">
			<div>
				<button class="dropdown-item" @click="unbanUser(user)">
					Unban: {{ user.username }}
				</button>
			</div>
		</ul>
</template>

<script lang="ts">

import { defineComponent, type PropType } from "vue";
import { makeApiCall } from "@/utils/ApiCall";

interface DataObject {
	bannedUsers: User[],
}

export default defineComponent({
	props: {
		chatId: {
			id: Number,
			required: true,
		},
	},
	data(): DataObject {
		return {
			bannedUsers: [],
		}
	},
	methods: {
		async unbanUser(user: User) {
			// const unbanResponse = await makeApiCall("chat/unban/" + this.chatId + "/" + user.id);
			// if (unbanResponse.ok) {
			// 	console.log("joechei");
			// }
		}
	},
	async mounted() {
		// const banListResponse = await makeApiCall("chat/banned/" + this.chatId);
    	// if (banListResponse.ok) {
        // 	this.bannedUsers = await banListResponse.json();
	},
})
</script>