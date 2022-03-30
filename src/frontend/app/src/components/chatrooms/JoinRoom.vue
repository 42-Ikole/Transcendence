<template>
	<div v-if="isNotJoined">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">
		<form class="card card-body" @submit.prevent="joinChat">
			<div v-if="chat.type === 'protected'">
				Room password:
				<input class="input_pass" placeholder="Password" :type="passwordVisibility" v-model="typedPassword" />
				<button class="button" type="button" @click="toggleShowPassword" >
					<i class="fas" :class="{ 'fa-eye-slash': showPassword, 'fa-eye': !showPassword }"></i>
				</button>
			</div>
			<input type="submit" value="Join" />
		</form>
	</div>
	<div v-else-if="isJoined">
		<Chatroom />
	</div>
</template>

<script lang="ts">

import Chatroom from './Chatroom.vue';
import { defineComponent } from 'vue';
import { Chat } from './Chatrooms.types.ts';

enum Room {
	NOTJOINED,
	JOINED,
}

interface DataObject {
	typedPassword: string;
	showPassword: boolean;
	room: Room;
}

export default defineComponent({
	props: {
		chat: {
			type: Object as PropType<Chat>,
			required: true,
		},
	},
	data(): DataObject {
		return {
			typedPassword: '',
			showPassword: false,
			room: Room.NOTJOINED,
		}
	},
	methods: {
		async joinChat() {
			if (this.typedPassword === this.chat.password) {
				this.room = Room.JOINED;
			}
			alert('Wrong password bitches');
		},
		toggleShowPassword() {
			this.showPassword = !this.showPassword;
		},
	},
	computed: {
		isNotJoined() {
			return this.room === Room.NOTJOINED;
		},
		isJoined() {
			return this.room === Room.JOINED;
		},
		passwordVisibility() {
			return this.showPassword ? 'text' : 'password';
		},
	},
	components: {
		Chatroom,
	}
})
</script>