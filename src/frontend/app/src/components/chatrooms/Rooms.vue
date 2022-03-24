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
		<JoinRoom />
	</div>
</template>

<script lang="ts">

import CreateRoom from './CreateRoom.vue';
import JoinRoom from  './JoinRoom.vue';
import { defineComponent } from 'vue';

enum State {
	WAITING,
	CREATING,
	JOINING
}

export default defineComponent({
	data() {
		return {
			state: State.WAITING as State,
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
		JoinRoom
	}
});

</script>