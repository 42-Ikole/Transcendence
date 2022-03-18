<template>
<div>
	<h2> Current Room: {{ room }}</h2>
	<input v-model="message" @keyup.enter="submit" placeholder="message">
	<button @click="submit">Submit</button>
	<p>
		<button v-for="room in rooms" @click="changeRoom(room)">{{ room }}</button>
	</p>
	<p v-for="msg in messages"> {{ msg }} </p>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';

interface DataComponent {
	rooms: string[];
	room: string,
	message: string;
	messages: string[];
	socket: Socket | null;
}

interface Message {
	message: string,
	room: string
}

export default defineComponent({
	data(): DataComponent {
		return {
			rooms: ["one", "two", "three"],
			room: "one",
			message: "",
			messages: [],
			socket: null,
		};
	},
	methods: {
		submit() {
			if (!this.message) {
				return;
			}
			this.socket!.emit('msgToServer', { message: this.message, room: this.room });
			this.message = "";
		},
		receive(msg: string) {
			this.messages.push(msg);
		},
		changeRoom(room: string) {
			this.socket!.emit("leaveRoom", this.room);
			this.socket!.emit("joinRoom", room);
			this.room = room;
		},
	},
	created() {
		this.socket = io("http://localhost:3000/chat");
		this.socket.on('msgToClient', (msg: any) => {
			this.receive(msg);
		});
		this.socket.on('status', (msg: any) => {
			console.log("Status:", msg);
		});
		this.socket.emit("joinRoom", this.room);
		// console.log("socket io");
		// console.log("done");
	},
	beforeUnmount() {
		this.socket!.disconnect();
	},
});
</script>
