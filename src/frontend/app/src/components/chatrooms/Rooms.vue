<template>
	<div v-if="isWaiting">
		<button @click="create">Create room</button>
		&nbsp;
		<button @click="join">Join room</button>
	</div>
	<div v-else-if="isCreating">
		<CreateRoom />
	</div>
	<div v-else-if="isJoining">
		<RoomsList />
	</div>
</template>

<script lang="ts">

import CreateRoom from './CreateRoom.vue';
import RoomsList from  './RoomsList.vue';
import { defineComponent } from 'vue';

enum State {
	WAITING,
	CREATING,
	JOINING
}

interface DataObject {
	state: State;
}

export default defineComponent({
	data(): DataObject {
		return {
			state: State.WAITING,
		};
	},
	computed: {
		isWaiting() {
			return this.state === State.WAITING;
		},
		isCreating() {
			return this.state === State.CREATING;
		},
		isJoining() {
			return this.state === State.JOINING;
		}
	},
	methods: {
		create() {
			this.state = State.CREATING;
		},
		join() {
			this.state = State.JOINING;
		}
	},
	components: {
		CreateRoom,
		RoomsList
	}
});

</script>