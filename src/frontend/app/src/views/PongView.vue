<template>
	<FindMatch />
	<!-- <PongGame /> -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PongGame from "@/components/Pong/PongGame.vue"
import FindMatch from "@/components/Pong/FindMatch.vue"

export default defineComponent({
	components: {
		PongGame,
		FindMatch
	},
});
</script>
