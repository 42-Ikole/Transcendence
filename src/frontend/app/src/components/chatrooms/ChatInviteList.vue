<template>
	<h5 class="dropdown-header">Invite Users:</h5>
		<ul class="btn" v-for="user in usersToInvite" :key="user.id">
			<div>
				<button class="dropdown-item" @click="inviteUser(user)">
					Invite: {{ user.username }}
				</button>
			</div>
		</ul>
	<hr class="dropdown-divider" />
	<h5 class="dropdown-header">Uninvite Users:</h5>
		<ul class="btn" v-for="user in invitedUsersArray" :key="user.id">
			<div>
				<button class="dropdown-item" @click="uninviteUser(user)">
					Uninvite: {{ user.username }}
				</button>
			</div>
		</ul>
</template>

<script lang="ts">

import { defineComponent, type PropType } from "vue";
import { makeApiCall, makeApiCallJson } from "@/utils/ApiCall";
import { PublicUser } from "@/types/UserType";
import { useSocketStore } from "@/stores/SocketStore";
import { mapState } from "pinia";

interface DataObject {
	allUsers: PublicUser[],
	usersInChat: Set<number>;
	invitedUsers: Set<number>;
}

export default defineComponent ({
	props: {
		usersInChatArray: {
			users: Object as PropType<PublicUser>,
			required: true,
		},
		chatId: {
			id: Number,
			required: true,
		},
	},
	data(): DataObject {
		return {
			allUsers: [],
			invitedUsersArray: [],
			invitedUsers: new Set<number>(),
		}
	},
	methods: {
		async inviteUser(user: User) {
			const inviteResponse = await makeApiCallJson("/chat/invite", "POST", {chatId: this.chatId, userId: user.id} );
		},
		async uninviteUser(user: User) {
			const cancelChatResponse = await makeApiCallJson("/chat/invite", "DELETE", {
				chatId: this.chatId,
				userId: user.id,
			});
		},
		async refreshInvites() {
			const inviteResponse = await makeApiCall(`/chat/invite/${this.chatId}`);
			if (inviteResponse.ok) {
				this.invitedUsersArray = await inviteResponse.json();
				this.invitedUsers = new Set(this.invitedUsersArray.map((user) => user.id));
			}
		},
	},
	computed: {
		...mapState(useSocketStore, ["chat"]),
		usersToInvite() {
			return this.allUsers.filter((user) => {
				return !this.usersInChat.has(user.id) && !this.invitedUsers.has(user.id);
			});
		},
		usersToUninvite() {
			return Array.from(this.invitedUsers);;
		},
		usersInChat() {
			return new Set(this.usersInChatArray.map((user) => user.id));
		},
	},
	async mounted() {
		const usersResponse = await makeApiCall("/user/all");
    	if (usersResponse.ok) {
			this.allUsers = await usersResponse.json();
    	}
		await this.refreshInvites();
		this.chat!.emit('subscribeChatUpdateInvite', { id: this.chatId });
		this.chat!.on(`chatUpdateInvite_${this.chatId}`, this.refreshInvites);
	},
	unmounted() {
		this.chat!.removeListener(`chatUpdateInvite_${this.chatId}`, this.refreshInvites);
		this.chat!.emit('unsubscribeChatUpdateInvite', { id: this.chatId });
	}
})
</script>
