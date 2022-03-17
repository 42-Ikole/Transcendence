<template>
<div>
	<h1>Web Sockets</h1>
	<input v-model="message" @keyup.enter="submit" placeholder="message">
	<button @click="submit">Submit</button>
	<p>
		<ul>
			<li v-for="msg in messages"> {{ msg }} </li>
		</ul>
	</p>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import io from 'socket.io-client';

export default defineComponent({
	data() {
		return {
			message: "",
			messages: [] as string[],
			socket: null as any
		};
	},
	methods: {
		submit() {
			this.socket.emit('msgToServer', this.message);
			this.message = "";
		},
		receive(msg: string) {
			this.messages.push(msg);
		}
	},
	created() {
		this.socket = io("http://localhost:3000/chat");
		this.socket.on('msgToClient', (msg: any) => {
			this.receive(msg);
		});
		// console.log("socket io");
		// console.log("done");
	},
	beforeUnmount() {
		this.socket.disconnect();
	},
});
</script>
