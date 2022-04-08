<template>
	<div class="container py-5" v-if="isWaiting">
		<div class="card-header justify-content-between align-items-center p-3" style="width: 30%; background-color: #dee;">
			<h3>Listed chatrooms:</h3>
			<!-- <div class="card dropdown" v-for="chat in filterPrivateChats" :key="chat.id">
				<p class="btn-link" data-bs-toggle="collapse" v-bind:href="'#chat' + chat.id" role="button"> {{ chat.name }} </p>
				<div class="collapse" v-bind:id="'chat' + chat.id">
					<JoinRoom :chat="chat" />
				</div>
			</div> -->
			<form class="form-check" v-for="chat in filterPrivateChats" :key="chat.id">
				<input class="form-check-input" type="radio" v-bind:value="chat.name" v-model="roomSelected" />
				<label class="form-check-label" for=roomSelected> {{ chat.name }} </label>
				<a v-if="chat.type === 'protected'" >
					<ChatLockIcon />
					<!-- <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg> -->

				</a>
				<div v-if="roomSelected === chat.name && chat.type === 'protected'">
					<input class="input_pass" placeholder="Password" :type="passwordVisibility" v-model="typedPassword" />
					<button class="button" type="button" @click="toggleShowPassword" >
						<i v-if="showPassword">
							<EyeClosed />
						</i>
						<i v-else>
							<EyeOpen />
						</i>
					</button>
				</div>
			</form>
			<button class="btn btn-info btn-sm float-end" @click="createRoom">Create room</button>
			<button class="btn btn-success btn-sm" v-bind:disabled="roomSelected === ''" @click="joinRoom">Join room</button>
		</div>
	</div>
	<div v-if="isJoining">
		<ChatRoom :chat="selectedChat" />
	</div>
	<div v-if="isCreating">
		<CreateRoom @roomCreated="setWaiting" />
	</div>
</template>

<script lang="ts">

import CreateRoom from './CreateRoom.vue';
import JoinRoom from './JoinRoom.vue';
import ChatRoom from './Chatroom.vue';
import { defineComponent } from 'vue';
import { makeApiCall } from '@/utils/ApiCall';
import { Chat } from './Chatrooms.types.ts';
import { useSocketStore } from '@/stores/SocketStore';
import { mapState } from 'pinia';
import ChatLockIcon from '../icons/IconChatLock.vue';
import EyeOpen from '../icons/IconEyeOpen.vue';
import EyeClosed from '../icons/IconEyeClosed.vue';

enum State {
	WAITING,
	CREATING,
	JOINING,
}

interface DataObject {
	chats: Chat[];
	selectedChat: Chat;
	state: State;
	roomSelected: string;
	typedPassword: string;
	showPassword: boolean;
}

export default defineComponent({
	data(): DataObject {
		return {
			chats: [],
			selectedChat: [],
			state: State.WAITING,
			roomSelected: '',
			typedPassword: '',
			showPassword: false,
		};
	},
	computed: {
		isWaiting() {
			return this.state === State.WAITING;
		},
		isCreating() {
			return this.state === State.CREATING;
		},
		isJoining() {
			return this.state === State.JOINING;
		},
		filterPrivateChats() {
			return this.chats;
		},
		passwordVisibility() {
			return this.showPassword ? 'text' : 'password';
		},
		...mapState(useSocketStore, {
			socket: 'chat',
		}),
	},
	methods: {
		createRoom() {
			this.state = State.CREATING;
		},
		async joinRoom() {
			for (let chat of this.chats) {
				if (chat.name === this.roomSelected) {
					// mark gaat deze check doen op beckham.
					if (chat.type !== 'protected' || this.typedPassword === chat.password) { 
						this.selectedChat = chat;
						this.socket.emit("joinRoom", {roonName: this.roomSelected});
						this.state = State.JOINING;
					}
				}
			}
			// const response = await makeApiCall('/chat/' + this.roomSelected);
			// if (response.ok) {
			// 	this.selectedChat = await response.json();
			// 	console.log('selected: ', this.selectedChat);
			// 	if (this.typedPassword === this.selectedChat.password) {
			// 		this.socket.emit("joinRoom", {roomName: this.selectedChat.name});
			// 		this.state = State.JOINING;
			// 	} else {
			// 		alert('Wrong password bitches');
			// 	}
			// }
		},
		toggleShowPassword() {
			this.showPassword = !this.showPassword;
		},
		setWaiting() {
			this.state = State.WAITING;
			this.getAllChats();
		},
		async getAllChats() {
			const response = await makeApiCall('/chat');
			if (response.ok) {
			this.chats = await response.json();
			}
		}
	},
	async mounted() {
		await this.getAllChats();
	},
	watch: {
		roomSelected(newRoom, oldRoom) {
			if (oldRoom !== this.roomSelected) {
				this.typedPassword = '';
			}
		},
	},
	components: {
		CreateRoom,
		ChatRoom,
		ChatLockIcon,
		EyeOpen,
		EyeClosed,
	}
});

</script>