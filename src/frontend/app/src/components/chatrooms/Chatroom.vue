<template>
	<div class="container py-5">
		<div class="row d-flex justify-content-center">
			<div style="width: 20%; background-color: #dee;">
				<div class="card">
					<div class="card-header d-flex justify-content-between align-items-center p-3">
						<h5 class="mb-0">Users in chat:</h5>
					</div>
					<div class="card-body" style="height: 500px; overflow-y: scroll;">
						<div class="flex-row justify-content-start">
							<div class="small" v-for="user in users">
								<OnlineStatus :fill="isOnline ? 'green' : 'red'" />
								<a style="padding-left: 5px;">
									{{ user.username }}
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div style="width: 60%; background-color: #eee;">
				<div class="card">
					<div class="card-header d-flex justify-content-between align-items-center p-3">
						<h5 class="mb-0"> {{ this.chat.name }} </h5>
						<button type="button" class="btn btn-danger btn-sm" data-mdb-ripple-color="dark" style="line-height: 1;" @click="leaveRoom">Leave chat</button>
					</div>
					<div id="autoScrollBottom" class="card-body" style="height: 500px; overflow-y: scroll; padding-bottom: 25px;">
						<div class="flex-row justify-content-start">
							<div class="small" v-for="message in this.messages">
								{{ message.author.username }}: {{ message.message }}
							</div>
						</div>
					</div>
					<div class="card-footer d-flex justify-content-start p-3">
						<form class="form-control form-control-lg" @submit.prevent="sendMessage">
							<input style="min-width: 65%; max-width: 10px;" type="text" placeholder="Type message" v-model="myMessage" ref="messageBox" />
							<input class="btn btn-info btn-rounded float-end" type="submit" value="Send" />
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { PublicUser } from '../../types/UserType.ts';
import io from 'socket.io-client';
import { useSocketStore } from '@/stores/SocketStore';
import { mapState } from 'pinia';
import { Chat, SendChatMessage } from './Chatrooms.types.ts';
import { makeApiCall } from '@/utils/ApiCall';
import OnlineStatus from '../icons/IconChatOnlineStatus.vue';

interface DataObject {
	myMessage: string;
	users: PublicUser[];
	messageToChat: SendChatMessage;
	messages: any[];
	userOnline: boolean;
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
			myMessage: '',
			users: [],
			messageToChat: {
				chatName: '',
				message: '',
			},
			messages: [],
			userOnline: true,
		};
	},
	methods: {
		sendMessage() {
			this.messageToChat.chatName = this.chat.name;
			this.messageToChat.message = this.myMessage;
			this.socket.emit('messageToChat', this.messageToChat);
			this.myMessage = '';
		},
		receivedMessage(message) {
			if (this.chat.name === message.chatName) {
				this.messages.push(message.message);

				const autoScroll = this.$el.querySelector("#autoScrollBottom");
				autoScroll.scrollTop = autoScroll.scrollHeight;
			}
		},
		userJoinsChat(joinData) {
			if (joinData.chatName === this.chat.name) {
				this.users.push(joinData.user);
			}
		},
		userLeavesChat(leaveData) {
			if (leaveData.chatName === this.chat.name) {
				this.users = this.users.filter(item => item.id !== leaveData.user.id);
			}
		},
		switchToRoomList() {
			this.$emit('roomLeft');
		},
		leaveRoom() {
			this.socket.emit('leaveRoom', { roomName: this.chat.name });
		},
		async refreshChat() {
			const messagesResponse = await makeApiCall('/chat/messages/' + this.chat.name);
			if (messagesResponse.ok) {
				this.messages = await messagesResponse.json();
				this.$refs.messageBox.focus();
			}
			const usersResponse = await makeApiCall('/chat/users/' + this.chat.name);
			if (usersResponse.ok) {
				this.users = await usersResponse.json();
			}
		},
	},
	created() {
		this.socket.on('messageToClient', (message) => {
			this.receivedMessage(message);
		});
		this.socket.on('userJoinedRoom', (joinData) => {
			this.userJoinsChat(joinData);
		});
		this.socket.on('userLeftRoom', (leaveData) => {
			this.userLeavesChat(leaveData);
		});
		this.socket.on('leaveRoomSuccess', () => {
			this.switchToRoomList();
		});
	},
	computed: {
		...mapState(useSocketStore, {
			socket: 'chat',
		}),
		isOnline() {
			return this.userOnline;
		},
	},
	async mounted() {
		await this.refreshChat();
	},
	components: {
		OnlineStatus,
	},
})

</script>