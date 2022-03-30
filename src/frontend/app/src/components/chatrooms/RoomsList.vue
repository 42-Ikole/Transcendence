<template>
		<div class="conv_joining">
			<h3>Listed chatrooms:</h3>
			<div class="dropdown" v-for="chat in filterPrivateChats" :key="chat.id">
				<p class="btn btn-primary" data-bs-toggle="collapse" v-bind:href="'#chat' + chat.id" role="button" aria-expanded="false" aria-controls="collapseExample"> {{ chat.name }} </p>
				<div class="collapse" v-bind:id="'chat' + chat.id">
					<JoinRoom :chat="chat" />
				</div>
			</div>
		</div>
</template>

<script lang="ts">

import JoinRoom from './JoinRoom.vue';
import { defineComponent } from 'vue';
import { makeApiCall } from '@/utils/ApiCall';
import { Chat } from './Chatrooms.types.ts';

interface DataObject {
	chats: Chat[];
}

export default defineComponent({
	data(): DataObject {
		return {
			chats: [],
		};
	},
	computed: {
		filterPrivateChats() {
			return this.chats.filter(t => t.type !== 'private');
		},
	},
	components: {
		JoinRoom,
	},
	async mounted() {
		const response = await makeApiCall('/chat');
		if (response.ok) {
			this.chats = await response.json();
		}
	},
})

</script>

<style scoped>

	.conv_joining {
		width: 400px;
		height: 200px;
		padding: 0px 10px;
		margin: auto;
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