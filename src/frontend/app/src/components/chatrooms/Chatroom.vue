<template>
	<div id="chatbox">
		<div id="msgbox">
			<div class="messages">
				<div v-for="message in messages"> {{ message }} </div>
			</div>
		</div>
			<form id="sendmsgbox" @submit.prevent="sendMessage">
				<input class="typedmsg" type="text" placeholder="Type message" v-model="myMessage" />
				<input class="submitbutton" type="submit" value="Send" />
			</form>
		<div>
			<div v-for="user in users"> {{ user }} </div>
		</div>
	</div>
</template>

<script lang="ts">

import io from 'socket.io-client';
import { useSocketStore } from '@/stores/SocketStore';
import { mapState } from 'pinia';

interface DataObject {
	myMessage: string;
	messages: string[];
	users: any[];
}

export default {
	data(): DataObject {
		return {
			myMessage: '',
			messages: [],
			users: [],
		};
	},
	methods: {
		sendMessage() {
			console.log(`send: ${this.myMessage}`); //debug
			this.socket.emit('messageToChat', this.myMessage);
			this.myMessage = '';
		},
		receivedMessage(message) {
			console.log(`recv: ${message}`); //debug
			this.messages.push(message);
		},
		addUserToList(user) {
			console.log(`user joined: ${user}`); //debug
			this.users.push(user);
		},
		removeUserFromList(user) {
			console.log(`user left: ${newUser}`); //debug
			this.users = this.users.filter((t) => t !== user);
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
	}
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

	#sendmsgbox {
	}

	.typedmsg {
	}

	.submitbutton {
	}

	.messages {
		text-align: left;
		padding: 0px 5px;
	}

</style>