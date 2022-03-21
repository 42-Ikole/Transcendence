<template>
	<PongGame />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PongGame from "@/components/Pong/PongGame.vue"

export default defineComponent({
	components: {
		PongGame
	},
});
</script>
