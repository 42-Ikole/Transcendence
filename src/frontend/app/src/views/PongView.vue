<template>
	<!-- <SquareGame /> -->
	<PongGame />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SquareGame from "@/components/Pong/SquareGame.vue"
import PongGame from "../components/Pong/PongGame.vue"

export default defineComponent({
	components: {
    SquareGame,
    PongGame
},
});
</script>
