<template>
	<div v-if="isNotCreated">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">
		<form class="conv_creation" @submit.prevent="createChat">
			<h3>Creating a new chat room.</h3>
			<div id="chosing_type">
				<div class="one_elem">
					<input type="radio" value="public" v-model="type" />
					<label for="public">Public</label>
				</div>
				<div class="one_elem">
					<input type="radio" value="private" v-model="type" />
					<label for="private">Private</label>
				</div>
				<div class="one_elem">
					<input type="radio" value="protected" v-model="type" />
					<label for="protected">Protected</label>
				</div>
			</div>
			<div>
				Room name: <input class="input_name" placeholder="Type here" type="text" v-model="name" />
			</div>
			<div v-if="type === 'protected'">
				Room password:
				<input class="input_pass" placeholder="Password" :type="passwordVisibility" v-model="pass" />
				<button class="button" type="button" @click="toggleShowPassword" >
					<i class="fas" :class="{ 'fa-eye-slash': showPassword, 'fa-eye': !showPassword }"></i>
				</button>
			</div>
			<input v-bind:disabled="invalidRoomInput === true" type="submit" value="Create" />
		</form>
	</div>
	<div v-else-if="isCreated">
		<RoomsList />
	</div>
</template>

<script lang="ts">

import RoomsList from './RoomsList.vue';
import { defineComponent } from 'vue';
import { makeApiCallJson } from "@/utils/ApiCall";
import { Chat } from './Chatrooms.types.ts';

enum Room {
	NOTCREATED,
	CREATED
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
			room: Room.NOTCREATED,
		};
	},
	methods: {
		async createChat() {
			if (this.name === '' || (this.type === 'protected' && this.pass === '')) {
				return ;
			}
			const response = await makeApiCallJson("/chat", "POST", { type: this.type, name: this.name, password: this.pass });
			if (response.ok) {
				this.room = Room.CREATED;
			}
		},
		toggleShowPassword() {
			this.showPassword = !this.showPassword;
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
		isNotCreated() {
			return this.room === Room.NOTCREATED;
		},
		isCreated() {
			return this.room === Room.CREATED;
		},
		invalidRoomInput() {
			if (this.type === '' || this.name === '' || (this.type === 'protected' && this.pass === '')) {
				return true;
			}
			return false;
		},
		passwordVisibility() {
			return this.showPassword ? 'text' : 'password';
		},
	},
	components: {
		RoomsList,
	},
})

</script>

<style scoped>

	.conv_creation {
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