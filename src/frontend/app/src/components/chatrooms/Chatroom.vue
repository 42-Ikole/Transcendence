<template>
	<div id="chatbox">
		<div id="msgbox">
			<div class="messages">
				<div v-for="msg in messages"> {{ msg }} </div>
			</div>
		</div>
			<form id="sendmsgbox" @submit.prevent="sendMessage">
				<input class="typedmsg" type="text" placeholder="Type message" v-model="myMessage" />
				<input class="submitbutton" type="submit" value="Send" />
			</form>
	</div>
</template>

<script lang="ts">

import io from 'socket.io-client';
import makeApiCall from '../../utils/ApiCall.ts'

export default {
	data() {
		return {
			myMessage: '',
			messages: [],
			socket: null
		};
	},
	methods: {
		sendMessage() {
			console.log(`send: ${this.myMessage}`); //debug
			this.socket.emit('messageToServer', this.myMessage);
			this.myMessage = '';
		},
		receivedMessage(msg) {
			console.log(`recv: ${msg}`); //debug
			this.messages.push(msg);
		}
	},
	created() {
		this.socket = io('http://localhost:3000/chat');
		this.socket.on('messageToClient', (msg) => {
			this.receivedMessage(msg);
		});
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