<template>
	<h5 class="dropdown-header">Online users:</h5>
		<ul class="btn" v-for="user in filteredUsersInChat" :key="user.id">
			<div>
				<button class="dropdown-item" @click="inviteUser(user)">
					{{ user.username }}
				</button>
			</div>
		</ul>
</template>

<script lang="ts">

import { defineComponent, type PropType } from "vue";
import { makeApiCall } from "@/utils/ApiCall";

interface DataObject {
	allUsers: Users[],
	usersNotInChat: Users[],
}

export default defineComponent ({
	props: {
		usersInChat: {
			users: Object as PropType<PublicUser>,
			required: true,
		},
	},
	data(): DataObject {
		return {
			allUsers: [],
			usersNotInChat: [],
		}
	},
	methods: {
		inviteUser(user: User) {
			console.log('id invite: ', user.id);
		}
	},
	computed: {
		filteredUsersInChat() {
			return this.allUsers.filter((el) => { return this.usersInChat.find((element) => el.id !== element.id) });
		}
	},
	async mounted() {
		const usersResponse = await makeApiCall("/user/all");
    	if (usersResponse.ok) {
			this.allUsers = await usersResponse.json();
    	}
	},
	unmounted() {

	},
})

</script>