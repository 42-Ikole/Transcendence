<template>
	<div class="container py-5" v-if="isWaiting">
		<div class="card-header justify-content-between align-items-center p-3" style="width: 30%; background-color: #dee;">
			<h3>Listed chatrooms:</h3>
			<form class="form-check" v-for="chat in filterPrivateChats" :key="chat.id">
				<input class="form-check-input" type="radio" v-bind:value="chat.name" v-model="selectedChatName" />
				<label class="form-check-label" for=selectedChatName> {{ chat.name }} </label>
				<a v-if="chat.type === 'protected'" >
					<ChatLockIcon />
				</a>
				<div v-if="selectedChatName === chat.name && chat.type === 'protected'">
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
			<button class="btn btn-success btn-sm" v-bind:disabled="selectedChatName === ''" @click="joinRoom">Join room</button>
		</div>
	</div>
	<div v-if="isJoining">
		<Chatroom :chat="selectedChat" />
	</div>
	<div v-if="isCreating">
		<CreateRoom @roomCreated="setWaiting" />
	</div>
</template>

<script lang="ts">

import CreateRoom from './CreateRoom.vue';
import Chatroom from './Chatroom.vue';
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
	state: State;
	chats: Chat[];
	selectedChat: Chat;
	selectedChatName: string;
	typedPassword: string;
	showPassword: boolean;
}

export default defineComponent({
	data(): DataObject {
		return {
			state: State.WAITING,
			chats: [],
			selectedChat: [],
			selectedChatName: '',
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
				if (chat.name === this.selectedChatName) {
					// mark gaat deze check doen op beckham.
					if (chat.type !== 'protected' || this.typedPassword === chat.password) { 
						this.selectedChat = chat;
						this.socket.emit("joinRoom", { roomName: this.selectedChatName });
						this.state = State.JOINING;
					}
				}
			}
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
		selectedChatName(newRoom, oldRoom) {
			if (oldRoom !== this.selectedChatName) {
				this.typedPassword = '';
			}
		},
	},
	components: {
		CreateRoom,
		Chatroom,
		ChatLockIcon,
		EyeOpen,
		EyeClosed,
	}
});

</script>