<template>
	<div class="card-header align-items-center" v-if="isNotCreated">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">
		<form class="card-header justify-content-between align-items-center p-3" style="width: 40%; background-color: #eee;" @submit.prevent="createChat">
			<h3 >Creating a new chat room.</h3>
			<div class="card card-body">
				<div class="form-check">
					<input class="form-check-input" type="radio" value="public" v-model="type" />
					<label class="form-check-label" for="public">Public</label>
				</div>
				<div class="form-check">
					<input class="form-check-input" type="radio" value="private" v-model="type" />
					<label class="form-check-label" for="private">Private</label>
				</div>
				<div class="form-check">
					<input class="form-check-input" type="radio" value="protected" v-model="type" />
					<label class="form-check-label" for="protected">Protected</label>
				</div>
			</div>
			<div class="card-header justify-content-between">
				Room name: <input class="card-title col-7" placeholder="Type here" type="text" v-model="name" />
				<div v-if="type === 'protected'">
					Room password:
					<input class="card-title"  style="margin: 0px 7.5px 0px 7.5px;" placeholder="Password" :type="passwordVisibility" v-model="pass" />
					<button type="button" @click="toggleShowPassword" >
						<i class="fas" :class="{ 'fa-eye-slash': showPassword, 'fa-eye': !showPassword }"></i>
					</button>
				</div>
				<div>
					<input class="btn btn-success" style="line-height: 1;" v-bind:disabled="invalidRoomInput === true" type="submit" value="Create" />
				</div>
			</div>
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