<template>
	<div id="chatbox">
		<form id="sendmsg" @submit.prevent="sendMessage">
			<input class="typedmsg" type="text" placeholder="Type message" v-model="myMessage" />
			<input class="submitbutton" type="submit" value="Send" />
		</form>
		<div class="messages">
			<div v-for="msg in messages"> {{ msg }} </div>
		</div>
	</div>
</template>

<script lang="ts">

export default {
	data() {
		return {
			myMessage: '',
			messages: []
		};
	},
	methods: {
		sendMessage() {
			//socket.emit('message', this.message);
			this.messages.push(this.myMessage);
			this.myMessage = '';
		}
	}
}

</script>

<style scoped>

	#chatbox {
		margin: auto;
		height: 400px;
		width: 600px;
		border: solid 2.5px grey;
		align-items: left;
        overflow-y: scroll;
        overflow-x: scroll;
        scroll-snap-type: y proximity;
		position: relative;
	}

	#sendmsg {
		position: absolute;
		bottom: 0px;
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