<template>
	<button @click="requestMatch">Find Match</button>
</template>

<script lang="ts">
import { useSocketStore } from "@/stores/SocketStore";
import { defineComponent } from "vue"

export default defineComponent({
	methods: {
		requestMatch() {
			useSocketStore().pong!.emit('requestMatch');
		},
	},
});
</script>