<template>
	<div v-if="isNotJoined">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">
		<div class="conv_joining">
			<h3>Joining a chat room.</h3>
			<div id="chosing_type">
				<div class="one_elem">
					<input type="radio" value="public" v-model="type" />
					<label for="public">Public</label>
				</div>
				<div class="one_elem">
					<input type="radio" value="protected" v-model="type" />
					<label for="protected">Protected</label>
				</div>
			</div>
			<div>
				Room name: <input class="input_name" placeholder="Type here" type="text" v-model="name"/>
			</div>
			<div v-if="type === 'protected'">
				Room password:
					<input v-if="showPassword" class="input_pass" placeholder="Password" type="text" v-model="pass" />
					<input v-else class="input_pass" placeholder="Password" type="password" v-model="pass" />
				<button class="button" @click="toggleShowPassword">
					<i class="fas" :class="{ 'fa-eye-slash': showPassword, 'fa-eye': !showPassword }"></i>
				</button>
			</div>

			<button v-bind:disabled="invalidRoomInput === true" @click="joinChat" >Join</button>
		</div>
	</div>
	<div v-else-if="isJoined">
		<Chatroom />
	</div>

</template>

<script lang="ts">

import Chatroom from './Chatroom.vue';
import { defineComponent } from 'vue';

enum Room {
	NOTJOINED,
	JOINED,
}

interface DataObject {
	type: string;
	name: string;
	pass: string;
	showPassword: boolean;
	room: Room;
}

export default defineComponent({
	data(): DataObject {
		return {
			type: '',
			name: '',
			pass: '',
			showPassword: false,
			room: Room.NOTJOINED,
		};
	},
	methods: {
		async joinChat() {
			if (this.name === '' || (this.type === 'protected' && this.pass === '')) {
				return ;
			}
			// checken of de room bestaat.
			this.room = Room.JOINED;
		},
		toggleShowPassword() {
			this.showPassword = !this.showPassword
		},
	},
	watch: {
		type(newType, oldType) {
			if (oldType !== 'protected') {
				this.pass = '';
			}
		},
	},
	computed: {
		isNotJoined() {
			return this.room === Room.NOTJOINED;
		},
		isJoined() {
			return this.room === Room.JOINED;
		},
		invalidRoomInput() {
			if (this.type === '' || this.name === '' || (this.type === 'protected' && this.pass === '')) {
				return true;
			}
			return false;
		},
	},
	components: {
		Chatroom,
	}
})

</script>

<style scoped>

	.conv_joining {
		width: 380px;
		height: 200px;
		padding: 0px 10px;
		margin: auto;
		border: 2.5px solid #000044;
		text-align: left;
	}

	#chosing_type {
		display: flex;
	}

	.one_elem {
		flex-direction: column;
		margin: 5px 0px;
		margin-right: 15px;
	}

	.input_name {
		margin: 5px 0px;
	}

	.input_pass {
		margin: 5px 0px;
	}
	
</style>