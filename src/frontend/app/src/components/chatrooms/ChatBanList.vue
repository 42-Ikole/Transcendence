<template>
	<h5 class="dropdown-header">Banned users:</h5>
		<ul class="btn" v-for="user in bannedUsers" :key="user.id">
			<div>
				<button class="dropdown-item" @click="unbanUser(user)">
					Unban: {{ user.username }}
				</button>
			</div>
		</ul>
	<hr class="dropdown-divider" />
	<h5 class="dropdown-header">Muted users:</h5>
		<ul class="btn" v-for="user in mutedUsers" :key="user.id">
			<div>
				<button class="dropdown-item" @click="unmuteUser(user)">
					Unmute: {{ user.username }}
				</button>
			</div>
		</ul>
</template>

<script lang="ts">

import { defineComponent, type PropType } from "vue";
import { makeApiCall, makeApiCallJson } from "@/utils/ApiCall";

interface DataObject {
	bannedUsers: User[],
	mutedUsers: User[],
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
			mutedUsers: [],
		}
	},
	methods: {
		async unbanUser(user: User) {
			console.log("chat id: ", this.chatId);
			console.log("user id: ", user.id);
			const unbanResponse = await makeApiCallJson("/chat/ban", "DELETE", {
				chatId: this.chatId,
				userId: user.id,
			});
			if (unbanResponse.ok) {
				console.log(user.id, " is unbanned from chat: ", this.chatId);
			}
		},
		async unmuteUser(user: User) {
			const unmuteResponse = await makeApiCallJson("/chat/mute", "DELETE", {
				chatId: this.chatId,
				userId: user.id,
			});
			if (unmuteResponse.ok) {
				console.log(user.id, " is unmuted from chat: ", this.chatId);
			}
		},
	},
	async mounted() {
		const banListResponse = await makeApiCall("/chat/ban/" + this.chatId);
    	if (banListResponse.ok) {
			this.bannedUsers = await banListResponse.json();
		}

		const muteListResponse = await makeApiCall("/chat/mute/" + this.chatId);
		if (muteListResponse.ok) {
			this.mutedUsers = await muteListResponse.json();
		}
	},
})
</script>