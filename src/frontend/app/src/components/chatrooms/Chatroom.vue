<template>
	<div id="chatbox">
		<div id="msgbox">
			<div class="messages text-white">
				<div v-for="message in this.chat.messages" > {{ message }} </div>
			</div>
		</div>
		<div id="userpanel row">
			<form class="sendmsgbox col" @submit.prevent="sendMessage">
				<input class="typedmsg" type="text" placeholder="Type message" v-model="myMessage" ref="messageBox" />
				<input class="submitbutton" type="submit" value="Send" />
			</form>
			<button class="btn btn-danger col" @click="leaveChat">Leave</button>
		</div>
		<div>
			Users in chat:
			<div v-for="user in users"> {{ user }} </div>
		</div>
	</div>
</template>

<script lang="ts">

import io from 'socket.io-client';
import { useSocketStore } from '@/stores/SocketStore';
import { mapState } from 'pinia';
import { Chat, SendChatMessage } from './Chatrooms.types.ts';

interface DataObject {
	myMessage: string;
	messages: string[];
	users: any[];
	messageToChat: SendChatMessage;
}

export default {
	props: {
		chat: {
			type: Object as PropType<Chat>,
			required: true,
		},
	},
	data(): DataObject {
		console.log(this.chat);
		return {
			myMessage: '',
		//	messages: [],
			users: [],
			messageToChat: [],
		};
	},
	methods: {
		sendMessage() {
			this.messageToChat.chatName = this.chat.name;
			this.messageToChat.message = this.myMessage;
			console.log(`send: ${this.myMessage} roomname: ${this.chat.name}`); //debug
			this.socket.emit('messageToChat', this.messageToChat);
			//this.chat.messages.push(this.myMessage);
			this.myMessage = '';
		},
		receivedMessage(message) {
			console.log(`recv: ${message}`); //debug
			this.chat.messages.push(message);
		},
		addUserToList(user) {
			console.log(`user joined: ${user}`); //debug
			this.users.push(user);
		},
		removeUserFromList(user) {
			console.log(`user left: ${newUser}`); //debug
			this.users = this.users.filter((t) => t !== user);
		},
		leaveChat() {
			console.log("ga weg");
		},
	},
	created() {
		this.socket.on('messageToClient', (message) => {
			this.receivedMessage(message);
		});
		this.socket.on('userJoinedChat', (user) => {
			this.addUserToList(user);
		});
		this.socket.on('userLeftChat', (user) => {
			this.removeUserFromList(user);
		});
	},
	computed: {
		...mapState(useSocketStore, {
			socket: 'chat',
		}),
	},
	mounted() {
		this.$refs.messageBox.focus();
	},
}

</script>

<style scoped>

	#chatbox {
		margin-left: 25%;
	}

	#msgbox {
		height: 400px;
		width: 600px;
		border: solid 0.5px grey;
		align-items: left;
        overflow-y: scroll;
        scroll-snap-type: y proximity;
		position: relative;
	}

	.messages {
		text-align: left;
		padding: 0px 5px;
	}

</style>