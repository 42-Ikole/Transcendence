<template>
	<div class="row">
		<h2>Match history:</h2>
		<div class="col-sm-6">
			<MatchCard />
		</div>
		
		<div class="col-sm-6">
			<MatchCard />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MatchCard from "@/components/pong/MatchCard.vue";

export default defineComponent({
	components: {
		MatchCard
	}
})

</script>
