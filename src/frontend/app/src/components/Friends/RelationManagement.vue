<template>
	<UserList name="Friends" :users="friends" />
	<UserList name="Requests" :users="friendRequests" />
	<UserList name="Blocked Users" :users="blockedUsers" />
	<UserList name="Online Users" :users="users" />
</template>

<script lang="ts">
import { useFriendStore } from "@/stores/FriendStore";
import makeApiCall from "@/utils/ApiCall";
import { mapState } from "pinia";
import { defineComponent } from "vue";
import UserList from "./UserList.vue";

export default defineComponent({
	data() {
		return {
			users: [],
		}
	},
	computed: {
		...mapState(useFriendStore, [
			"friends",
			"friendRequests",
			"blockedUsers",
		]),
	},
	async mounted() {
		await useFriendStore().refresh();
		const response = await makeApiCall("/user/all");
		this.users = await response.json();
	},
	components: {
		UserList,
	}
});
</script>
